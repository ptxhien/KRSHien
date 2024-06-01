import function
import pandas as pd
from difflib import SequenceMatcher
from datetime import timedelta
import os
import dao
from sklearn.metrics.pairwise import pairwise_distances
from math import cos, asin, sqrt
import numpy as np
from datetime import timedelta

# -*- coding: utf-8 -*-

# 1. Language
def Xet_Language(df_Onl, df_Off, filter, lst_lan):
    flat_language = 0
    df = df_Onl if filter == "online" else df_Off
    course_know = function.findCourseOn_basedOn_Language(df, lst_lan)
    if course_know.empty:
        flat_language = -1
    return df, flat_language

# 2.  Location
def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Bán kính Trái đất tính bằng km
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = np.sin(dlat / 2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon / 2)**2
    c = 2 * np.arcsin(np.sqrt(a))
    return R * c

# Hàm tính khoảng cách và sắp xếp DataFrame
def Xet_Location(df_C, lat1, lon1):
    df_C['distance'] = df_C.apply(
        lambda row: haversine(lat1, lon1, row['latitude'], row['longitude']) 
        if pd.notnull(row['latitude']) and pd.notnull(row['longitude']) 
        else np.nan, axis=1)
    
    df_C = df_C.dropna(subset=['distance']).sort_values(by='distance')
    return df_C


# 3. StudyForm and FrameTime
def Xet_FrameStudy_JobNow(df, Job_Now, str_lst_frametime):
    if Job_Now.startswith(('work', 'study')):
        df = df[df['studyForm'].str.startswith('Part time')]
        if df.empty:
            return df, 1
        
        lst_t_learner = str_lst_frametime.split('|')
        df = pd.concat([function.FindCoursebasedStudyTime(df, t) for t in lst_t_learner], ignore_index=True)
        if df.empty:
            return df, 1
        
    return df, 0

# 4. Fee

from datetime import timedelta

def TinhSumDurationRS(df1, condition_duration):
    flat_sum_duration = 0
    sum_learn_duration = '00:00:00'
    sum_course_duration = '00:00:00'
    kq_hocthem = '00:00:00'

    if condition_duration > 0:
        sum_second_learn = int(condition_duration)
        sum_learn_duration = str(timedelta(seconds=sum_second_learn))

        sum_second_course = int(df1['durationSecond'].sum())
        sum_course_duration = str(timedelta(seconds=sum_second_course))

        if sum_second_course > sum_second_learn:
            flat_sum_duration = -1
            duration_bothem = sum_second_course - sum_second_learn
            kq_hocthem = str(timedelta(seconds=duration_bothem))
    
    return flat_sum_duration, sum_learn_duration, sum_course_duration, kq_hocthem


def Course_Learner_Fee(df, feeMax):
    if feeMax:
        nguong_max = function.convertfee(feeMax)
        df = df[df['feeVND'].cumsum() <= nguong_max]
    return df

# 5. Duration
# def TinhSumDurationRS(df1, condition_duration):
#     if condition_duration > 0:
#         sum_second_learn = pd.to_numeric(condition_duration)
#         sum_second_course = df1['durationSecond'].sum()
#         if sum_second_course > sum_second_learn:
#             return -1, str(timedelta(seconds=sum_second_learn)), str(timedelta(seconds=sum_second_course)), str(timedelta(seconds=sum_second_course - sum_second_learn))
#     return 0, str(timedelta(seconds=condition_duration)), str(timedelta(seconds=df1['durationSecond'].sum())), '00:00:00'

def TinhSumDurationRS(df1, condition_duration):
    flat_sum_duration = 0
    duration_bothem = 0
    kq_hocthem = 0

    if condition_duration > 0:
        sum_learn_duration = "{:0>8}".format(
            str(timedelta(seconds=np.float64(condition_duration))))
        sum_second_learn = pd.to_numeric(
            condition_duration, downcast='integer')

        sum_second_course = df1['durationSecond'].sum()
        sum_course_duration = "{:0>8}".format(
            str(timedelta(seconds=np.float64(sum_second_course))))

        if sum_second_course > sum_second_learn:
            flat_sum_duration = -1
            duration_bothem = sum_second_course - sum_second_learn
            kq_hocthem = "{:0>8}".format(
                str(timedelta(seconds=np.float64(duration_bothem))))
    return flat_sum_duration, sum_learn_duration, sum_course_duration, kq_hocthem


def Course_Learner_Duration(df, condition_duration):
    if int(condition_duration) > 0:
        df['cum_duration'] = df['durationSecond'].cumsum()
        df = df[df['cum_duration'] <= condition_duration].drop(columns=['cum_duration'])
    return df


# 6. Job simmilar
def Jac_Simmilar():
    conn = dao.create_connection()
    df = dao.select_job(conn)

    # Tạo danh sách tất cả các kỹ năng
    lst_all_Tech = sorted(set(tec for row in df['technologySkill'] for tec in row.split(', ') if tec))

    # Tạo ma trận nhị phân kỹ năng cho từng công việc
    df_Course_Filter = df[['jobID']].copy()
    for tech in lst_all_Tech:
        df_Course_Filter[tech] = df['technologySkill'].apply(lambda x: 1 if tech in x.split(', ') else 0)

    # Tính ma trận Jaccard
    df_Courses_Jaccard = df_Course_Filter.drop(columns='jobID').T
    jac_sim1 = 1 - pairwise_distances(df_Courses_Jaccard.T, metric="hamming")
    jac_sim1 = pd.DataFrame(jac_sim1, index=df_Courses_Jaccard.columns, columns=df_Courses_Jaccard.columns)

    # Đặt lại các cột và hàng cho phù hợp
    jac_sim1.index = df_Course_Filter['jobID']
    jac_sim1.columns = df_Course_Filter['jobID']
    return jac_sim1

def get_top5_similar(JobID):
    jac_sim = Jac_Simmilar()
    similar_score = jac_sim[JobID].sort_values(ascending=False).head(6)
    return similar_score

def job_related(job_id):
    conn = dao.create_connection()
    df = dao.select_job(conn)

    df_get = get_top5_similar(job_id)
    new_data = pd.merge(df_get, df, how='left', on="jobID")

    lst_job_sim = new_data['jobTitle'].unique().tolist()
    return lst_job_sim

