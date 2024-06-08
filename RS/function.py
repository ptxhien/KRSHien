from curses import KEY_A1
import json
import pandas as pd
import dao
import numpy as np
from difflib import SequenceMatcher
from math import *
import json
from math import cos, asin, sqrt
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics import pairwise_distances
from sentence_transformers import SentenceTransformer
from sklearn.decomposition import PCA
import torch

# 1. Find courses studied
def Find_Courses_Studied(email):
    conn = dao.create_connection()
    df_Learner = dao.select_l(conn)
    df_Learner = df_Learner[df_Learner['email'] == email]
    df_Learner = df_Learner.reset_index(drop=True)
    learner_id = df_Learner['learnerID'][0]

    df_Invoice = dao.select_invoice(conn)
    df_loc_his = df_Invoice.copy()
    df_loc_his = df_loc_his.loc[df_loc_his.LearnerID == learner_id]

    lst_courses_studied = []
    [lst_courses_studied.append(r['CourseID']) for i, r in df_loc_his.iterrows() if r['CourseID'] not in lst_courses_studied]

    lst_courses_studied.sort()
    return lst_courses_studied


# 2.2 Find Skills Job Requirement
def read_rule_job():
    with open('Rule_Job.json', 'r') as f:
        data = json.load(f)
    return data

def Find_Require_Job(occupation_id):
    data = read_rule_job()
    d_skill, d_title, d_knowledge, d_embedding = {}, "", "", []
    for i in data:
        if i['JobID'] == occupation_id:
            d_skill = i['Weight_Technology']
            d_title = i['JobTitle']
            d_knowledge = i['knowledge']
            d_embedding = i['embedding']
    d_skill = dict(sorted(d_skill.items(), key=lambda x: x[1], reverse=True))
    return d_skill, d_title, d_knowledge,d_embedding


# 3. Find dictionary Skill User Missing
def FindMissingSkill1(df_attribute_requirement):
    missing_skill, d_title, d_knowledge, d_embedding = Find_Require_Job(df_attribute_requirement.Occupation[0])

    skill_now_learner = []
    [skill_now_learner.append(tec) for id, row in df_attribute_requirement.iterrows() for tec in row.loc['technologySkill'].split(', ') if tec != '' and tec not in skill_now_learner]
    skill_now_learner.sort()

    common_l = list(set(skill_now_learner) & set(missing_skill))
    if len(common_l) > 0:
        [missing_skill.pop(i) for i in common_l]
   
    return missing_skill


def FindMissingSkill(df_attribute_requirement):
    occupation_id = df_attribute_requirement.Occupation[0]
    dict_missing_skill, d_title, d_knowledge,d_embedding = Find_Require_Job(occupation_id)
    lst_weight_sort = sorted(dict_missing_skill, key = dict_missing_skill.get, reverse=True)

    skill_now_learner = []
    [skill_now_learner.append(tec) for id, row in df_attribute_requirement.iterrows() for tec in row.loc['technologySkill'].split(', ') if tec != '' and tec not in skill_now_learner]
    skill_now_learner.sort()

    common_l = list( set (skill_now_learner) & set(lst_weight_sort) )
    if len(common_l) > 0:
        [lst_weight_sort.remove(i) for i in common_l]
        
    return lst_weight_sort


# 4. Find courses contains missing skills
def FindCourseFromMissingSkill(df, df_attribute_requirement):
    missing_skill = FindMissingSkill(df_attribute_requirement)

    if not missing_skill:
        return pd.DataFrame()

    df_Course_Filter = df[['courseID', 'courseTitle', 'technologySkill']].copy()
    df_Course_Filter['technologySkill'] = df_Course_Filter['technologySkill'].fillna('')

    skills_set = set(missing_skill)
    skills_df = df_Course_Filter['technologySkill'].str.get_dummies(sep=', ').reindex(columns=skills_set, fill_value=0)
    
    df_Course_Filter = df_Course_Filter.join(skills_df)
    df_Course_Filter['Tech_Skill'] = skills_df.apply(lambda row: ', '.join(skills_set.intersection(row.index[row == 1])), axis=1)
    df_Course_Filter['Num_Skill'] = df_Course_Filter['Tech_Skill'].str.count(', ') + 1
    df_Course_Filter = df_Course_Filter[df_Course_Filter['Num_Skill'] > 0]

    occupation = df_attribute_requirement.Occupation.iloc[0]
    d_skill, d_title, d_knowledge, d_embedding =Find_Require_Job(occupation)

    def calculate_sum_weight(tech_skills):
        return sum(d_skill.get(skill.strip(), 0) for skill in tech_skills.split(', '))

    df_Course_Filter['Sum_Weight'] = df_Course_Filter['Tech_Skill'].apply(calculate_sum_weight)

    def calculate_remaining_skills(row):
        tech_skills = set(row['technologySkill'].split(', '))
        acquired_skills = set(row['Tech_Skill'].split(', '))
        remaining_skills = tech_skills - acquired_skills
        return ", ".join(remaining_skills), len(remaining_skills)

    tech_remain_info = df_Course_Filter.apply(calculate_remaining_skills, axis=1)
    df_Course_Filter['Tech_Remain'], df_Course_Filter['Num_Tech_Remain'] = zip(*tech_remain_info)

    return df_Course_Filter


# 4. Take courses
# Online
def take_CourseOnline(df_attribute_requirement):
    email = df_attribute_requirement.email[0]
    df_courses_On = pd.DataFrame()
    
    conn = dao.create_connection()
    df_Course_Online = dao.select_courseOnline(conn)
    df_Online = df_Course_Online.copy()
    
    
    df_loc_On = FindCourseFromMissingSkill(
        df_Course_Online, df_attribute_requirement)

    if len(df_loc_On) > 0:
        df_loc_On = df_loc_On[['courseID', 'courseTitle', 'technologySkill',
                               'Tech_Skill', 'Num_Skill', 'Sum_Weight', 'Tech_Remain', 'Num_Tech_Remain']]
        lst_courses_studied = Find_Courses_Studied(email)
        if len(lst_courses_studied) > 0:
            for i in lst_courses_studied:
                df_loc_On = df_loc_On.drop(
                    df_loc_On[df_loc_On['courseID'] == i].index)

        df_Online = df_Online[['courseID', 'outcomeLearning', 'URL', 'provider', 'duration', 'durationSecond',
                               'level', 'feeVND', 'majobSubject', 'rating', 'peopleRating', 
                               'numStudent', 'language','embedding_courses']]

        df_courses_On = pd.merge(df_loc_On, df_Online,
                                 how='left', on='courseID')
        df_courses_On.feeVND = df_courses_On.feeVND.apply(lambda x: float(x))
    return df_courses_On

# offline
def take_CourseOffline(df_attribute_requirement):
    email = df_attribute_requirement.email.iloc[0]

    conn = dao.create_connection()
    df_Course_Offline = dao.select_courseOffline(conn)

    df_loc_Off = FindCourseFromMissingSkill(df_Course_Offline, df_attribute_requirement)

    if not df_loc_Off.empty:
        df_loc_Off = df_loc_Off[['courseID', 'Tech_Skill', 'Num_Skill', 'Sum_Weight', 'Tech_Remain', 'Num_Tech_Remain']]

        lst_courses_studied = Find_Courses_Studied(email)
        if lst_courses_studied:
            df_loc_Off = df_loc_Off[~df_loc_Off['courseID'].isin(lst_courses_studied)]

        df_courses_Off = pd.merge(df_loc_Off, df_Course_Offline, on='courseID', how='left')
        df_courses_Off.fillna('', inplace=True)

        return df_courses_Off

    return pd.DataFrame()

# 5. find similar bert courses - knowledgeDomain

def similar_bert(df_courses_On_f, occupation_id):
    import ast
    d_skill, d_title, d_knowledge, query_embedding = Find_Require_Job(occupation_id)

    def convert_to_list(embedding_str):
        if isinstance(embedding_str, str):
            return ast.literal_eval(embedding_str)
        return embedding_str

    df_courses_On_f['embedding_courses'] = df_courses_On_f['embedding_courses'].apply(convert_to_list)

    embeddings = np.array(df_courses_On_f['embedding_courses'].tolist(), dtype='float64')

    similarities = cosine_similarity([query_embedding], embeddings)[0]
   
    df_courses_On_f['similarity'] = similarities
    return df_courses_On_f


# df_1 = similar_bert(df_courses_On_f, occupation_id)
# df_1.head(1)
# 5. Find languages user know
def Language_Learner_Know(df_attribute_requirement):
    return df_attribute_requirement['language'].str.split(', ').explode().unique().tolist()


# 6. Find languages remain in courses
def Find_Language_Remaining_LearnNotKnow(df, lst_lan_know):
    lst_lan_know = set(lst_lan_know)
    lst_allLan = set(df['language'].str.split(', ').explode().unique())
    remaining_languages = lst_allLan - lst_lan_know
    return sorted(remaining_languages)

# 7.  find courses by language
def findCourseOn_basedOn_Language(df, lst_lan):
    df_Filter = df.copy()
    lst_lan = list(set(lst_lan))  

    df_Filter['language'] = df_Filter['language'].fillna('')

    language_matrix = np.zeros((len(df_Filter), len(lst_lan)), dtype=int)

    for i, lan in enumerate(lst_lan):
        language_matrix[:, i] = df_Filter['language'].apply(lambda x: 1 if lan in x.split(', ') else 0).values

    language_df = pd.DataFrame(language_matrix, columns=lst_lan)

    df_Filter['Sum_Lan'] = language_df.apply(lambda row: ', '.join([lan for lan in lst_lan if row[lan] == 1]), axis=1)
    df_Filter['Num_Lan'] = language_df.sum(axis=1)

    df_Filter = df_Filter[df_Filter['Num_Lan'] > 0]
    df_Filter = df_Filter[['courseID', 'Sum_Lan']].merge(df, on='courseID')

    return df_Filter


# 8. Find frame time where offline courses are open
def Find_List_FrameTime(df):
    lst_StudyTime = set()
    for study_times in df['studyTime'].str.split('|'):
        lst_StudyTime.update(item for item in study_times if item)
    return sorted(lst_StudyTime)

def Find_List_FrameTime_Remain(df, t_learner):
    lst_StudyTime = set(Find_List_FrameTime(df))
    lst_t_learner = set(t_learner.split('|'))
    return list(lst_StudyTime - lst_t_learner)


# 9.  find the skills that RS advises
def LstTech(df):
    lst_T = set()
    for tech_skills in df['Tech_Skill'].str.split(', '):
        lst_T.update(tec for tec in tech_skills if tec)
    return list(lst_T)

def LstTechCourse_Provider(df, occupation_id):
    d_F = {}
    d_skill, d_title, d_knowledge,d_embedding = Find_Require_Job(occupation_id)
    lst_T = LstTech(df)

    for tech in lst_T:
        if tech in d_skill:
            d_F[tech] = d_skill[tech]
    return d_F

def LstTechCourse_NotProvider(d_F, missing_skill):
    return {key: missing_skill[key] for key in missing_skill if key not in d_F}

def lst_Skill_RS(df, missing_skill, occupation):
    lstSkill_Provider = LstTechCourse_Provider(df, occupation)
    lstSkill_notProvider = LstTechCourse_NotProvider(lstSkill_Provider, missing_skill)
    return lstSkill_Provider, lstSkill_notProvider



# 10. Compare Fee
def convertfee(fee_Learner):
    thresholds = {'0': 5000000, '1': 15000000, '2': 30000000, '3': 100000000}
    return float(thresholds.get(fee_Learner, 0))

def FindFeeLess(df, feeMax):
    nguong_max = convertfee(feeMax)
    df_filtered = df[(df['feeVND'] >= 0) & (df['feeVND'] <= nguong_max)]
    flat_fee = -1 if df_filtered.empty else 0
    return df_filtered, flat_fee


# 11. Recommend courses according to the top that provide the most skills
def standardize(series):
    return (series - series.min()) / (series.max() - series.min())

def Course_Weight_Top_BERT(df_RS, filter_type):
    alpha = 0.4
    belta = 0.4

    if len(df_RS) > 1:
        df_RS["Sum_Weight_Stand"] = standardize(df_RS["Sum_Weight"])
        df_RS["Num_Tech_Remain_Stand"] = standardize(df_RS["Num_Tech_Remain"])
        df_RS['similarity'] = standardize(df_RS['similarity'])
        df_RS["Weight"] = alpha * df_RS["Sum_Weight_Stand"] + belta * df_RS["similarity"] + (1 - alpha - belta) * df_RS["Num_Tech_Remain_Stand"]

        if filter_type.lower() == "online":
            df_RS = df_RS.sort_values(['Weight', 'numStudent', 'rating'], ascending=[False, False, False])
        else:
            df_RS = df_RS.sort_values('Weight', ascending=False)

    return df_RS.head(10)


# 12. Recommend courses according learning path
def Course_Weight_BERT(rule_On, occupation_id, filter_type):
    alpha = 0.4
    belta = 0.4

    # Chuẩn hóa các cột cần thiết
    df_RS = rule_On.copy()
    df_RS["Sum_Weight_Stand"] = standardize(df_RS["Sum_Weight"])
    df_RS["Similarity_Stand"] = standardize(df_RS["similarity"])
    df_RS["Num_Tech_Remain_Stand"] = standardize(df_RS["Num_Tech_Remain"])

    # Tính trọng số
    df_RS["Weight"] = (alpha * df_RS["Sum_Weight_Stand"] +
                       belta * df_RS["Similarity_Stand"] +
                       (1 - alpha - belta) * df_RS["Num_Tech_Remain_Stand"])

    # Sắp xếp theo trọng số
    sort_cols = ['Weight', 'numStudent', 'rating'] if filter_type.lower() == "online" else ['Weight']
    df_RS = df_RS.sort_values(by=sort_cols, ascending=[False] * len(sort_cols))

    # Khởi tạo các tập kỹ năng và danh sách khóa học
    RS_Skill = set()
    Course_RS = []

    # Hàm cập nhật kỹ năng và khóa học
    def update_skills_and_courses(row, RS_Skill, Course_RS):
        tech_skills = set(row["Tech_Skill"].split(", "))
        new_skills = tech_skills - RS_Skill

        if new_skills:
            RS_Skill.update(new_skills)
            Course_RS.append(row)
        return RS_Skill, Course_RS

    # Lọc và sắp xếp các khóa học
    for _, row in df_RS.iterrows():
        tech_skills_set = set(row["Tech_Skill"].split(", "))
        
        if not tech_skills_set & RS_Skill:
            RS_Skill, Course_RS = update_skills_and_courses(row, RS_Skill, Course_RS)
        else:
            remaining_skills = tech_skills_set - RS_Skill
            if remaining_skills:
                d_skill, d_title, d_knowledge,d_embedding = Find_Require_Job(occupation_id)
                new_weights = {skill: d_skill.get(skill, 0) for skill in remaining_skills if d_skill.get(skill, 0) > 0}

                if new_weights:
                    row['Num_Skill'] = len(new_weights)
                    row['Tech_Skill'] = ", ".join(new_weights.keys())
                    row['Sum_Weight'] = sum(new_weights.values())
                    row['Sum_Weight_Stand'] = (row['Sum_Weight'] - df_RS['Sum_Weight'].min()) / (df_RS['Sum_Weight'].max() - df_RS['Sum_Weight'].min())
                    row['Weight'] = (alpha * row['Sum_Weight_Stand'] +
                                     belta * row['Similarity_Stand'] +
                                     (1 - alpha - belta) * row['Num_Tech_Remain_Stand'])
                    RS_Skill, Course_RS = update_skills_and_courses(row, RS_Skill, Course_RS)

    df_Course_RS = pd.DataFrame(Course_RS).sort_values(by='Weight', ascending=False)

    return df_Course_RS



# 13. Find offline courses based on learners' free time frames
def get_frame_days(t):
    f_time, days = t[:11], t[12:-1].split('-')
    return f_time, days

def is_time_in_range(sTime, learn_h_start, learn_s_start, learn_h_end, learn_s_end, lst_day, t_learner):
    sTime_h_start, sTime_s_start, sTime_h_end, sTime_s_end = map(int, [sTime[:2], sTime[3:5], sTime[6:8], sTime[9:11]])
    if not (learn_h_start <= sTime_h_start <= learn_h_end and learn_s_start <= sTime_s_start <= learn_s_end):
        return False
    if sTime[12:] == t_learner[12:]:
        return True
    common_days = set(lst_day) & set(get_frame_days(sTime)[1])
    return not common_days

def FindCoursebasedStudyTime(df, t_learner):
    f_time, lst_day = get_frame_days(t_learner)
    learn_h_start, learn_s_start, learn_h_end, learn_s_end = map(int, [f_time[:2], f_time[3:5], f_time[6:8], f_time[9:11]])

    def check_study_time(row):
        return any(is_time_in_range(sTime, learn_h_start, learn_s_start, learn_h_end, learn_s_end, lst_day, t_learner) 
                   for sTime in row['studyTime'].split('|'))

    df_filtered = df[df.apply(check_study_time, axis=1)]
    return df_filtered

# 14. Find filter name
def typeFilterName(typeFilter):
    return "" if typeFilter == 'top' else "Learning Path consists of "



