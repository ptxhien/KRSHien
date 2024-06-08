import function
import knowledgeDomain
import pandas as pd
# -*- coding: utf-8 -*-


def convertlst_toString(lst):
    return ", ".join(lst.keys())


def extract_courses_info(result):
    return [
        {
            "courseID": str(row["courseID"]),
            "courseTitle": str(row["courseTitle"]),
            "Tech_Skill": str(row["Tech_Skill"]),
            "studyTime": "",
            "studyForm": "",
            "technologySkill": str(row["technologySkill"]),
            "outcomeLearning": str(row["outcomeLearning"]),
            "provider": str(row["provider"]),
            "duration": str(row["duration"]),
            "feeVND": str(row["feeVND"]),
            "URL": str(row["URL"]),
            "language": str(row["language"]),
            "rating": str(row["rating"]),
            "peopleRating": str(row["peopleRating"]),
            "location": "",
            "level": str(row["level"]),
            "Weight": str(row["Weight"]),
            "is_online": "true"
        }
        for _, row in result.iterrows()
    ]

# build  online
def BuildRule_Online(df_On, missing_skill, str_skills_to_learn, lan_know, occupation_id, feeMax, condition_duration, typeFilter):
    flat_level = 0
    flat_language = 0
    
    dict_f_ngoaile = []
    dict_f = {}

    result = pd.DataFrame()
    result_ngoaile = pd.DataFrame()
    
    kq_result = []
    kq_result_ngoaile = []

    # job similarity
    lst_job_sim = knowledgeDomain.job_related(occupation_id)[1:]
    str_lst_job_sim = ", ".join(lst_job_sim)

    if not df_On.empty:
        rule_On_lan, flat_language = knowledgeDomain.Xet_Language(df_On, [], "online", lan_know)
        if not rule_On_lan.empty:
            rule_On_lan = rule_On_lan.loc[rule_On_lan.level.isin(['Beginner', 'ALL Levels'])]
            if not rule_On_lan.empty:
                rule_On_lan = function.similar_bert(rule_On_lan, occupation_id)
                rule_On_lan = (function.Course_Weight_Top_BERT(rule_On_lan, "online") if typeFilter.lower() == "top" else function.Course_Weight_BERT(rule_On_lan, occupation_id, "online"))
                result = rule_On_lan
            else:
                flat_level = -1
        else:
            lan_no_know = function.Find_Language_Remaining_LearnNotKnow(df_On, lan_know)
            str_lan_no_know = ", ".join(lan_no_know)
            rule_On_remain, flat_language = knowledgeDomain.Xet_Language(df_On, [], "online", lan_no_know)
            if not rule_On_remain.empty:
                rule_On_remain = rule_On_remain.loc[rule_On_remain.level.isin(['Beginner', 'ALL Levels'])]
                if not rule_On_remain.empty:
                    rule_On_remain = function.similar_bert(rule_On_remain, occupation_id)
                    rule_On_remain = (function.Course_Weight_Top_BERT(rule_On_remain, "online") if typeFilter.lower() == "top" else function.Course_Weight_BERT(rule_On_remain, occupation_id, "online"))
                    result_ngoaile = rule_On_remain
                    flat_language = -1
                else:
                    flat_language = -1
                    flat_level = -1

        kq_result = extract_courses_info(result)
        kq_result_ngoaile = extract_courses_info(result_ngoaile)

        if (flat_language == -1 and flat_level == -1) or (flat_language == 0 and flat_level == -1):
            dict_f_ngoaile.append({"ExceptionType": "Lan, Level", "Job_offer": str_lst_job_sim})
            dict_f = {"status": 401, "message": "Lan, Level", "Course": [], "Exception": dict_f_ngoaile, "Ngoai_Le": {"Course_Offer": [], "ExceptionDetail": []}}
        elif flat_language == -1 and flat_level == 0:
            lstSkill_Provider_ngoaile, lstSkill_notProvider_ngoaile = function.lst_Skill_RS(result_ngoaile, str_skills_to_learn, occupation_id)
            dict_f_ngoaile.append({"ExceptionType": "Lan", "lan_remain": str_lan_no_know})
            dict_f_ngoaile.append({"lstSkill_Provider_ngoaile": convertlst_toString(lstSkill_Provider_ngoaile), "lstSkill_notProvider_ngoaile": ", ".join(lstSkill_notProvider_ngoaile)})

            if typeFilter.lower() != "top":
                if feeMax:
                    flat_sum_fee_RS, fee_Learner, sum_fee_course, sum_bothem = knowledgeDomain.TinhSumFeeRS(result_ngoaile, feeMax)
                    nguong_max = function.convertfee(fee_Learner)
                    if flat_sum_fee_RS == -1:
                        dict_f_ngoaile.append({"ExceptionType": "Fee", "Input": str(nguong_max), "Output": str(sum_fee_course), "Balance": str(sum_bothem)})

                if condition_duration > 0:
                    flat_sum_duration, sum_learn_duration, sum_course_duration, kq_hocthem = knowledgeDomain.TinhSumDurationRS(result_ngoaile, condition_duration)
                    if flat_sum_duration == -1:
                        dict_f_ngoaile.append({"ExceptionType": "Duration", "Input": str(sum_learn_duration), "Output": str(sum_course_duration), "Balance": str(kq_hocthem)})

            dict_f = {"status": 402, "message": "Lan", "Course": [], "Exception": [], "Ngoai_Le": {"Course_Offer": kq_result_ngoaile, "ExceptionDetail": dict_f_ngoaile}}
        elif flat_language == 0 and flat_level == 0:
            lstSkill_Provider, lstSkill_notProvider = function.lst_Skill_RS(result, str_skills_to_learn, occupation_id)
            dict_f_ngoaile.append({"lstSkill_Provider": convertlst_toString(lstSkill_Provider), "lstSkill_notProvider": ", ".join(lstSkill_notProvider)})

            if typeFilter.lower() != "top":
                if feeMax:
                    flat_sum_fee_RS, fee_Learner, sum_fee_course, sum_bothem = knowledgeDomain.TinhSumFeeRS(result, feeMax)
                    nguong_max = function.convertfee(fee_Learner)
                    if flat_sum_fee_RS == -1:
                        dict_f_ngoaile.append({"ExceptionType": "Fee", "Input": str(nguong_max), "Output": str(sum_fee_course), "Balance": str(sum_bothem)})

                if condition_duration > 0:
                    flat_sum_duration, sum_learn_duration, sum_course_duration, kq_hocthem = knowledgeDomain.TinhSumDurationRS(result, condition_duration)
                    if flat_sum_duration == -1:
                        dict_f_ngoaile.append({"ExceptionType": "Duration", "Input": str(sum_learn_duration), "Output": str(sum_course_duration), "Balance": str(kq_hocthem)})

            dict_f = {"status": 200, "message": "PASS", "Course": kq_result, "Exception": dict_f_ngoaile, "Ngoai_Le": {"Course_Offer": [], "ExceptionDetail": []}}
    else:
        dict_f_ngoaile.append({"Job_offer": str_lst_job_sim})
        dict_f = {"status": 403, "message": "FAIL", "Course": [], "Exception": dict_f_ngoaile, "Ngoai_Le": {"Course_Offer": [], "ExceptionDetail": []}}

    return result, dict_f



# build  offline
def Test_Location_FreeTime_JobNow(result, lat1, lon1, Learner_Job_Now, Learner_FreeTime):
    flat_course_freetime = 0

    # 2. Location
    if lat1 and lon1:
        result = knowledgeDomain.Xet_Location(result, lat1, lon1)

    # 3. Frame time and Job now
    if not result.empty:
        free_time = '18:00-23:00' if not Learner_FreeTime else Learner_FreeTime
        result, flat_course_freetime = knowledgeDomain.Xet_FrameStudy_JobNow(result, Learner_Job_Now, free_time)

    return result, flat_course_freetime


def Test_Duration_Fee(result, condition_duration, feeMax, typeFilter):
    dict_f_ngoaile = []

    if not result.empty and typeFilter.lower() != "top":
        if feeMax:
            flat_sum_fee_RS, fee_Learner, sum_fee_course, sum_bothem = knowledgeDomain.TinhSumFeeRS(result, feeMax)
            nguong_max = function.convertfee(fee_Learner)
            if flat_sum_fee_RS == -1:
                dict_f_ngoaile.append({
                    "ExceptionType": "Fee",
                    "Input": str(nguong_max),
                    "Output": str(sum_fee_course),
                    "Balance": str(sum_bothem)
                })

        if condition_duration > 0:
            flat_sum_duration, sum_learn_duration, sum_course_duration, kq_hocthem = knowledgeDomain.TinhSumDurationRS(result, condition_duration)
            if flat_sum_duration == -1:
                dict_f_ngoaile.append({
                    "ExceptionType": "Duration",
                    "Input": str(sum_learn_duration),
                    "Output": str(sum_course_duration),
                    "Balance": str(kq_hocthem)
                })

    return result, dict_f_ngoaile

def Off_Lan_NotLan(result, missing_skill, str_skills_to_learn, occupation, feeMax, condition_duration, 
                   lat1, lon1, Learner_Job_Now, Learner_FreeTime, typeFilter, lan_no_know=None, is_language_matched=True):
    dict_f_Offline = {}
    dict_f_ngoaile = []
    kq_result = []

    result, flat_course_freetime = Test_Location_FreeTime_JobNow(result, lat1, lon1, Learner_Job_Now, Learner_FreeTime)

    if flat_course_freetime == 1:
        freetime_remain = function.Find_List_FrameTime_Remain(result, Learner_FreeTime)
        str_freetime_remain = ", ".join(freetime_remain)
        dict_f_ngoaile.append({"ExceptionType": "Frame_Remain", "frame_remain": str_freetime_remain})

    lstSkill_Provider, lstSkill_notProvider = function.lst_Skill_RS(result, str_skills_to_learn, occupation)
    str_new_lstSkill_Provider = convertlst_toString(lstSkill_Provider)
    str_new_lstSkill_notProvider = ", ".join(lstSkill_notProvider)

    if not result.empty:
        kq_result = [
            {
                "courseID": str(r['courseID']),
                "courseTitle": str(r['courseTitle']),
                "Tech_Skill": str(r['Tech_Skill']),
                "studyTime": str(r['studyTime']),
                "studyForm": str(r['studyForm']),
                "technologySkill": str(r['technologySkill']),
                "outcomeLearning": str(r['outcomeLearning']),
                "provider": str(r['provider']),
                "duration": str(r['duration']),
                "feeVND": str(r['feeVND']),
                "URL": str(r['URL']),
                "language": str(r['language']),
                "rating": "",
                "peopleRating": "",
                "location": str(r['location']),
                "level": str(r['level']),
                "is_online": "false"
            }
            for _, r in result.iterrows()
        ]

        if not is_language_matched:
            str_lan_no_know = ", ".join(lan_no_know) if lan_no_know else ""
            dict_f_ngoaile.append({"ExceptionType": 'Lan', "lan_remain": str_lan_no_know})

        result, dict_f_ngoaile_W = Test_Duration_Fee(result, condition_duration, feeMax, typeFilter)
        dict_f_ngoaile.extend(dict_f_ngoaile_W)

        dict_f_ngoaile.append({"lstSkill_Provider_ngoaile": str_new_lstSkill_Provider,
                               "lstSkill_notProvider_ngoaile": str_new_lstSkill_notProvider})

    dict_f_Offline = {
        "status": 201 if is_language_matched else 202,
        "message": "frameRemain_Fulltime",
        "Course": kq_result if is_language_matched else [],
        "Exception": dict_f_ngoaile if is_language_matched else [],
        "Ngoai_Le": {"Course_Offer": [] if is_language_matched else kq_result,
                     "ExceptionDetail": [] if is_language_matched else dict_f_ngoaile}
    }
    return result, dict_f_Offline


def BuildRule_Offline(df_Off, missing_skill, str_skills_to_learn, lan_know, lat1, lon1, occupation_id, Learner_Job_Now,
                      Learner_FreeTime, feeMax, condition_duration, typeFilter):
    flat_level = 0
    flat_language = 0

    dict_f_Offline = {}
    dict_f_ngoaile = []

    result = pd.DataFrame()

    # job similarity
    lst_job_sim = knowledgeDomain.job_related(occupation_id)
    str_lst_job_sim = ", ".join(lst_job_sim[1:])

    if not df_Off.empty:
        rule_Off_lan, flat_language = knowledgeDomain.Xet_Language([], df_Off, "offline", lan_know)
        rule_Off_lan = rule_Off_lan.loc[(rule_Off_lan.level == 'Beginner') | (rule_Off_lan.level == 'ALL Levels')]

        if not rule_Off_lan.empty:
            rule_Off_lan = function.similar_bert(rule_Off_lan, occupation_id)
            if typeFilter.lower() == "top":
                rule_Off_lan = function.Course_Weight_Top_BERT(rule_Off_lan, "offline")
            else:
                rule_Off_lan = function.Course_Weight_BERT(rule_Off_lan, occupation_id, "offline")
            result = rule_Off_lan
        else:
            flat_level = -1

        if rule_Off_lan.empty:
            lan_no_know = function.Find_Language_Remaining_LearnNotKnow(df_Off, lan_know)
            rule_Off_remain, flat_language = function.et_Language([], df_Off, "offline", lan_no_know)
            rule_Off_remain = rule_Off_remain.loc[(rule_Off_remain.level == 'Beginner') | (rule_Off_remain.level == 'ALL Levels')]

            if not rule_Off_remain.empty:
                rule_Off_remain = function.similar_bert(rule_Off_remain, occupation_id)
                if typeFilter.lower() == "top":
                    rule_Off_remain = function.Course_Weight_Top_BERT(rule_Off_remain, "offline")
                else:
                    rule_Off_remain = function.Course_Weight_BERT(rule_Off_remain, occupation_id, "offline")
                result = rule_Off_remain
                flat_language = -1
            else:
                flat_level = -1
                flat_language = -1

        if flat_language == -1 and flat_level == -1:
            dict_f_ngoaile.append({"ExceptionType": "Lan, Level", "Job_offer": str_lst_job_sim})
            dict_f_Offline = {"status": 401, "message": "Lan, Level", "Course": [], "Exception": dict_f_ngoaile,
                              "Ngoai_Le": {"Course_Offer": [], "ExceptionDetail": []}}
        elif flat_language == -1 and flat_level == 0:
            result, dict_f_Offline = Off_Lan_NotLan(result, missing_skill, str_skills_to_learn, occupation_id,
                                                    feeMax, condition_duration, lat1, lon1, Learner_Job_Now,
                                                    Learner_FreeTime, typeFilter, lan_no_know, is_language_matched=False)
        elif flat_language == 0 and flat_level == 0:
            result, dict_f_Offline = Off_Lan_NotLan(result, missing_skill, str_skills_to_learn, occupation_id,
                                                    feeMax, condition_duration, lat1, lon1, Learner_Job_Now,
                                                    Learner_FreeTime, typeFilter)
    else:
        dict_f_ngoaile.append({"Job_offer": str_lst_job_sim})
        dict_f_Offline = {"status": 403, "message": "FAIL", "Course": [], "Exception": dict_f_ngoaile,
                          "Ngoai_Le": {"Course_Offer": [], "ExceptionDetail": []}}
    return result, dict_f_Offline




# Check Online + Offline

def KiemTraNgoaiLe(df, missing_skill, str_skills_to_learn, lan_know, lat1, lon1, occupation_id, Learner_Job_Now, Learner_FreeTime, feeMax, condition_duration, typeFilter, form):
    if form == 'online':
        result, dict_f = BuildRule_Online(df, missing_skill, str_skills_to_learn, lan_know, occupation_id, feeMax, condition_duration, typeFilter)
    else:
        result, dict_f = BuildRule_Offline(df, missing_skill, str_skills_to_learn, lan_know, lat1, lon1, occupation_id, Learner_Job_Now, Learner_FreeTime, feeMax, condition_duration, typeFilter)
    return result, dict_f


# RECOMMENDATION SYSTEMS

def recommendation(df_On, df_Off, df_attribute_requirement):
    dict_f_ngoaile = []
    dict_f = {}

    typeFilter = df_attribute_requirement.typeFilter[0]
    typeFilter_Name = function.typeFilterName(typeFilter)

    str_skills_to_learn = function.FindMissingSkill1(df_attribute_requirement)
    missing_skill = function.FindMissingSkill(df_attribute_requirement)

    occupation_id = df_attribute_requirement.Occupation[0]
    skills_acquired, occupation_title, d_knowledge, d_embedding = function.Find_Require_Job(occupation_id)

    lan_know = df_attribute_requirement.language[0].split(', ')
    lat1 = df_attribute_requirement.latitude[0]
    lon1 = df_attribute_requirement.longitude[0]
    Form_require = df_attribute_requirement.Form_require[0].lower()
    Learner_Job_Now = df_attribute_requirement.jobNow[0]
    Learner_FreeTime = df_attribute_requirement.freeTime[0]
    feeMax = df_attribute_requirement.feeMax[0]
    condition_duration = df_attribute_requirement.durationSecond[0]

    lst_job_sim = knowledgeDomain.job_related(occupation_id)
    str_lst_job_sim = ", ".join(lst_job_sim[1:])

    if not Form_require:
        if Learner_Job_Now.startswith('work') or Learner_Job_Now.startswith('study'):
            result_online, dict_f_online = BuildRule_Online(df_On, missing_skill, str_skills_to_learn, lan_know,
                                                            occupation_id, feeMax, condition_duration, typeFilter)
            if result_online.empty:
                result_offline, kq_On = KiemTraNgoaiLe(df_Off, missing_skill, str_skills_to_learn, lan_know,
                                                       lat1, lon1, occupation_id, Learner_Job_Now,
                                                       Learner_FreeTime, feeMax, condition_duration, typeFilter, 'offline')
                dict_f_ngoaile = {
                    'occupation': occupation_title,
                    'typeFilter': typeFilter_Name,
                    'skills_acquired': skills_acquired,
                    'skills_to_learn': str_skills_to_learn,
                    'courses_online': dict_f_online,
                    'courses_offline': kq_On}
            else:
                dict_f_ngoaile.append({"job_offer": str_lst_job_sim})
                dict_f_ngoaile = {
                    'occupation': occupation_title,
                    'typeFilter': typeFilter_Name,
                    'skills_acquired': skills_acquired,
                    'skills_to_learn': str_skills_to_learn,
                    'courses_online': dict_f_online,
                    'courses_offline': {"status": 400, "message": "no courses", "Course": [],
                                        "Exception": dict_f_ngoaile, "Ngoai_Le": {"Course_Offer": [],
                                                                                  "ExceptionDetail": []}}}
        else:
            result_online, dict_f_online = BuildRule_Online(df_On, missing_skill, str_skills_to_learn, lan_know,
                                                            occupation_id, feeMax, condition_duration, typeFilter)
            result_offline, dict_f_Offline = BuildRule_Offline(df_Off, missing_skill, str_skills_to_learn, lan_know,
                                                               lat1, lon1, occupation_id, Learner_Job_Now,
                                                               Learner_FreeTime, feeMax, condition_duration, typeFilter)
            if not result_online.empty and not result_offline.empty:
                dict_f_ngoaile = {
                    'occupation': occupation_title,
                    'typeFilter': typeFilter_Name,
                    'skills_acquired': skills_acquired,
                    'skills_to_learn': str_skills_to_learn,
                    'courses_online': dict_f_online,
                    'courses_offline': dict_f_Offline}
            elif result_online.empty and not result_offline.empty:
                dict_f_ngoaile = {
                    'occupation': occupation_title,
                    'typeFilter': typeFilter_Name,
                    'skills_acquired': skills_acquired,
                    'skills_to_learn': str_skills_to_learn,
                    'courses_online': dict_f_online,
                    'courses_offline': dict_f_Offline}
            elif not result_online.empty and result_offline.empty:
                dict_f_ngoaile = {
                    'occupation': occupation_title,
                    'typeFilter': typeFilter_Name,
                    'skills_acquired': skills_acquired,
                    'skills_to_learn': str_skills_to_learn,
                    'courses_online': dict_f_online,
                    'courses_offline': dict_f_Offline}
            else:
                dict_f_ngoaile = {
                    'occupation': occupation_title,
                    'typeFilter': typeFilter_Name,
                    'skills_acquired': skills_acquired,
                    'skills_to_learn': str_skills_to_learn,
                    'courses_online': dict_f_online,
                    'courses_offline': dict_f_Offline}
        dict_f = dict_f_ngoaile

    elif Form_require.startswith('online'):
        df_rule, dict_onl = BuildRule_Online(df_On, missing_skill, str_skills_to_learn, lan_know, occupation_id,
                                             feeMax, condition_duration, typeFilter)
        dict_f_ngoaile.append({"Job_offer": str_lst_job_sim})
        dict_f_ngoaile = {
            'occupation': occupation_title,
            'typeFilter': typeFilter_Name,
            'skills_acquired': skills_acquired,
            'skills_to_learn': str_skills_to_learn,
            'courses_online': dict_onl,
            'courses_offline': {"status": 400, "message": "no courses", "Course": [], "Exception": dict_f_ngoaile,
                                "Ngoai_Le": {"Course_Offer": [], "ExceptionDetail": []}}}
        if df_rule.empty:
            result_Offline, kq_On = KiemTraNgoaiLe(df_Off, missing_skill, str_skills_to_learn, lan_know,
                                                   lat1, lon1, occupation_id, Learner_Job_Now, Learner_FreeTime,
                                                   feeMax, condition_duration, typeFilter, 'offline')
            dict_f_ngoaile = {
                'occupation': occupation_title,
                'typeFilter': typeFilter_Name,
                'skills_acquired': skills_acquired,
                'skills_to_learn': str_skills_to_learn,
                'courses_online': dict_onl,
                'courses_offline': kq_On}
        dict_f = dict_f_ngoaile

    else:
        df_rule, dict_off = BuildRule_Offline(df_Off, missing_skill, str_skills_to_learn, lan_know, lat1, lon1,
                                              occupation_id, Learner_Job_Now, Learner_FreeTime, feeMax,
                                              condition_duration, typeFilter)
        dict_f_ngoaile.append({"Job_offer": str_lst_job_sim})
        dict_f_ngoaile = {
            'occupation': occupation_title,
            'typeFilter': typeFilter_Name,
            'skills_acquired': skills_acquired,
            'skills_to_learn': str_skills_to_learn,
            'courses_online': {"status": 400, "message": "no courses", "Course": [], "Exception": dict_f_ngoaile,
                               "Ngoai_Le": {"Course_Offer": [], "ExceptionDetail": []}},
            'courses_offline': dict_off}

        if df_rule.empty:
            result_Offline, kq_Off = KiemTraNgoaiLe(df_On, missing_skill, str_skills_to_learn, lan_know,
                                                    occupation_id, feeMax, condition_duration, typeFilter, 'online')
            dict_f_ngoaile = {
                'occupation': occupation_title,
                'typeFilter': typeFilter_Name,
                'skills_acquired': skills_acquired,
                'skills_to_learn': str_skills_to_learn,
                'courses_online': kq_Off,
                'courses_offline': dict_off}
        dict_f = dict_f_ngoaile

    return dict_f
