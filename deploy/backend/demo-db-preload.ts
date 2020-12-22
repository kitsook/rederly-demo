import configurations from './configurations';
import { sync } from './database';
import database from './database';
import './extensions';
import logger from './utilities/logger';
import './global-error-handlers';
import { hashPassword } from './utilities/encryption-helper';

import Permission from './database/models/permission';
import Role from './features/permissions/roles';
import TopicType from './database/models/topic-type';
import University from './database/models/university';
import User from './database/models/user';
import Curriculum from './database/models/curriculum';
import Course from './database/models/course';
import CourseUnitContent from './database/models/course-unit-content';
import CourseTopicContent from './database/models/course-topic-content';
import CourseWWTopicQuestion from './database/models/course-ww-topic-question';
import StudentEnrollment from './database/models/student-enrollment';
import StudentGrade from './database/models/student-grade';
import TopicAssessmentInfo from './database/models/topic-assessment-info';

const DEFAULT_PASSWORD = 'letmein';
const NUM_PROF = 10;
const NUM_COURSE_PER_PROF = 3;
const NUM_STUDENT_PER_COURSE = 20;
const NUM_UNIT_PER_COURSE = 5;
const NUM_HOMEWORK_PER_UNIT = 2;
const NUM_ASSESSMENT_PER_UNIT = 1;
const NUM_QUESTION_PER_TOPIC = 6;

const SAMPLE_QUESTIONS = [
    'webwork-open-problem-library/Contrib/UBC/MATH/MATH105/blankProblem.pg',
    'Library/UBC/MECH/MECH2/Fluids/Mech2_2016-2017/UBC-FLU-17-100.pg',
    'Library/UBC/MECH/MECH2/Fluids/Mech2_2016-2017/UBC-FLU-17-102.pg',
    'Library/UBC/MECH/MECH2/Fluids/Mech2_2016-2017/UBC-FLU-17-103.pg',
    'Library/UBC/MECH/MECH2/Fluids/Mech2_2016-2017/UBC-FLU-17-104.pg',
    'Library/UBC/MECH/MECH2/Fluids/Mech2_2016-2017/UBC-FLU-17-105.pg',
    'Library/UBC/MECH/MECH2/Fluids/Mech2_2016-2017/UBC-FLU-17-106.pg',
    'Library/UBC/MECH/MECH2/Fluids/Mech2_2016-2017/UBC-FLU-17-107.pg',
    'Library/UBC/MECH/MECH2/Fluids/Mech2_2016-2017/UBC-FLU-17-108.pg',
    'Library/UBC/MECH/MECH2/Fluids/Mech2_2016-2017/UBC-FLU-17-109.pg',
    'Library/UBC/MECH/MECH2/Fluids/Mech2_2016-2017/UBC-FLU-17-110.pg',
    'Library/UBC/MECH/MECH2/Fluids/Mech2_2016-2017/UBC-FLU-17-112.pg',
    'Library/UBC/MECH/MECH2/Fluids/Mech2_2016-2017/UBC-FLU-17-113.pg',
    'Library/UBC/MECH/MECH2/Fluids/Mech2_2016-2017/UBC-FLU-17-114.pg',
    'Library/UBC/MECH/MECH2/Fluids/Mech2_2016-2017/UBC-FLU-17-117.pg',
    'Library/UBC/MECH/MECH2/Fluids/Mech2_2016-2017/UBC-FLU-17-118.pg',
    'Library/UBC/MECH/MECH2/Fluids/Mech2_2016-2017/UBC-FLU-17-121.pg',
    'Library/UBC/MECH/MECH2/Fluids/Mech2_2016-2017/UBC-FLU-17-129.pg',
    'Library/UBC/MECH/MECH2/Fluids/Mech2_2016-2017/UBC-FLU-17-130.pg',
    'Library/UBC/MECH/MECH2/Fluids/Mech2_2016-2017/UBC-FLU-17-131.pg',
    'Library/UBC/MECH/MECH2/Fluids/Mech2_2016-2017/UBC-FLU-17-132.pg',
    'Library/UBC/MECH/MECH2/Fluids/Mech2_2016-2017/UBC-FLU-17-133.pg',
    'Library/UBC/MECH/MECH2/Fluids/Mech2_2016-2017/UBC-FLU-17-134.pg',
    'Library/UBC/MECH/MECH2/Fluids/Mech2_2016-2017/UBC-FLU-17-135.pg',
    'Library/UBC/MECH/MECH2/Fluids/Mech2_2016-2017/UBC-FLU-17-148.pg',
    'Library/UBC/MECH/MECH2/Fluids/Mech2_2016-2017/UBC-FLU-17-149.pg',
    'Library/UBC/MATH/MATH105/DEinvestment.pg',
    'Library/UBC/MATH/MATH105/workPlay.pg',
    'Library/UBC/MATH/MATH105/LMInterpretation.pg',
    'Library/UBC/MATH/MATH105/LMindifference.pg',
]

// to run the typescript directly inside the backend container:
// npm ci
// npx ts-node ts-built/demo-db-preload.ts

async function loadPermission(t: any): Promise<void> {
    // why are we mixing the concept of "role" with "permission"?
    // and student = 0 while admin = 2??  we can't specify id=0 with sequelize...
    await Permission.create({
        // id: Role.STUDENT,
        active: true,
        roleName: 'student',
        permissionName: 'student',
        permissionDescription: 'student',
    }, { transaction: t });
    await Permission.create({
        // id: Role.PROFESSOR,
        active: true,
        roleName: 'professor',
        permissionName: 'professor',
        permissionDescription: 'professor',
    }, { transaction: t });
    await Permission.create({
        // id: Role.ADMIN,
        active: true,
        roleName: 'admin',
        permissionName: 'admin',
        permissionDescription: 'admin',
    }, { transaction: t });
    // ... hack to update the primary key
    database.appSequelize.query('UPDATE public.permission set permission_id=0 where permission_role_name=\'student\'', { transaction: t });
    database.appSequelize.query('UPDATE public.permission set permission_id=1 where permission_role_name=\'professor\'', { transaction: t });
    database.appSequelize.query('UPDATE public.permission set permission_id=2 where permission_role_name=\'admin\'', { transaction: t });
}

async function loadTopicType(t: any): Promise<TopicType[]> {
    let result: TopicType[] = [];
    result.push(await TopicType.create({
        name: 'Homework',
    }, { transaction: t }));
    result.push(await TopicType.create({
        name: 'Assessment',
    }, { transaction: t }));
    return result;
}

async function loadUniversity(t: any): Promise<University> {
    return await University.create({
        active: true,
        universityName: 'University of Example Dot Com',
        profEmailDomain: 'example.com',
        studentEmailDomain: 'example.com',
        verifyInstitutionalEmail: false,
    }, { transaction: t });
}

async function loadUserAdmin(t: any, university: University, unique_count: number): Promise<User> {
    return await User.create({
        active: true,
        universityId: university.id,
        roleId: Role.ADMIN,
        firstName: 'admin',
        lastName: unique_count,
        email: 'admin'+unique_count+'@example.com',
        password: await hashPassword(DEFAULT_PASSWORD),
        verified: true,
        actuallyVerified: true,
        preferredEmail: 'admin'+unique_count+'@example.com',
    }, { transaction: t });
}

async function loadUserProf(t: any, university: University, unique_count: number): Promise<User> {
    return await User.create({
        active: true,
        universityId: university.id,
        roleId: Role.PROFESSOR,
        firstName: 'prof',
        lastName: unique_count,
        email: 'prof'+unique_count+'@example.com',
        password: await hashPassword(DEFAULT_PASSWORD),
        verified: true,
        actuallyVerified: true,
        preferredEmail: 'prof'+unique_count+'@example.com',
    }, { transaction: t });
}

async function loadUserStudent(t: any, university: University, unique_count: number): Promise<User> {
    return await User.create({
        active: true,
        universityId: university.id,
        roleId: Role.STUDENT,
        firstName: 'student',
        lastName: unique_count,
        email: 'student'+unique_count+'@example.com',
        password: await hashPassword(DEFAULT_PASSWORD),
        verified: true,
        actuallyVerified: true,
        preferredEmail: 'student'+unique_count+'@example.com',
    }, { transaction: t });
}

async function loadCurriculum(t: any, university: University): Promise<Curriculum> {
    return await Curriculum.create({
        universityId: university.id,
        name: 'Curriculum',
        subject: 'Curriculum subject',
        comment: 'Curriculum comments',
        active: true,
        public: true,
    }, { transaction: t });
}

async function loadCourse(t: any, university: University, curriculum: Curriculum, instructor: User, unique_count: number): Promise<Course> {
    return await Course.create({
        active: true,
        curriculumId: curriculum.id,
        instructorId: instructor.id,
        universityId: university.id,
        name: 'Course ' + unique_count,
        code: 100 + unique_count,
        start: Date.now() - 30 * 24 * 60 * 60 * 1000,
        end: Date.now() + 30 * 24 * 60 * 60 * 1000,
        sectionCode: unique_count,
        semesterCode: 'WINTER' + (new Date()).getFullYear(),
        textbooks: 'Book ' + unique_count,
    }, { transaction: t });
}

async function loadCourseUnitContent(t: any, course: Course, unique_count: number): Promise<CourseUnitContent> {
    return await CourseUnitContent.create({
        courseId: course.id,
        name: 'Course Unit ' + unique_count,
        active: true,
        contentOrder: unique_count,
        curriculumUnitId: null,
    }, { transaction: t });
}

async function loadCourseTopicContent(t: any, course: Course, courseUnitContent: CourseUnitContent, topicType: TopicType, unique_count: number): Promise<CourseTopicContent> {
    return await CourseTopicContent.create({
        curriculumTopicContentId: null,
        courseUnitContentId: courseUnitContent.id,
        topicTypeId: topicType.id,
        name: topicType.name + ' ' + unique_count,
        active: true,
        contentOrder: unique_count,
        startDate: course.start,
        endDate: course.end,
        deadDate: course.end,
        partialExtend: false,
    }, { transaction: t });
}

async function loadCourseTopicQuestion(t: any, courseTopicContent: CourseTopicContent, unique_count: number): Promise<CourseWWTopicQuestion> {
    return await CourseWWTopicQuestion.create({
        courseTopicContentId: courseTopicContent.id,
        problemNumber: unique_count,
        webworkQuestionPath: SAMPLE_QUESTIONS[Math.floor(Math.random() * SAMPLE_QUESTIONS.length)],
        weight: 1,
        maxAttempts: 1,
        hidden: false,
        active: true,
        optional: false,
        curriculumQuestionId: null,
    }, { transaction: t });
}

async function loadStudentEnrollment(t: any, course: Course, user: User): Promise<StudentEnrollment> {
    return await StudentEnrollment.create({
        active: true,
        courseId: course.id,
        userId: user.id,
        enrollDate: course.start,
        dropDate: null,
    }, { transaction: t });
}

async function loadStudentGrade(t: any, user: User, courseTopicQuestion: CourseWWTopicQuestion): Promise<StudentGrade> {
    return await StudentGrade.create({
        active: true,
        userId: user.id,
        courseWWTopicQuestionId: courseTopicQuestion.id,
        randomSeed: Math.floor(Math.random() * 1024 ) + 1,
        numAttempts: 0,
        locked: false,
    }, { transaction: t });
}

async function loadTopicAssessmentInfo(t: any, courseTopicContent: CourseTopicContent): Promise<TopicAssessmentInfo> {
    return await TopicAssessmentInfo.create({
        courseTopicContentId: courseTopicContent.id,
        curriculumTopicAssessmentInfoId: null,
        duration: 5,
        hardCutoff: false,
        maxGradedAttemptsPerVersion: 1,
        maxVersions: 1,
        versionDelay: 0,
        hideHints: false,
        showTotalGradeImmediately: false,
        hideProblemsAfterFinish: false,
        randomizeOrder: false,
        active: true,
    }, { transaction: t });
}


(async (): Promise<void> => {
    try {
        await configurations.loadPromise;

        // drop and re-create the db
        await database.appSequelize.drop();
        await sync();
        let transaction = await database.appSequelize.transaction();

        await loadPermission(transaction);
        let topicTypes = await loadTopicType(transaction);
        let university: University = await loadUniversity(transaction);
        let curriculum = await loadCurriculum(transaction, university);

        // let admin1: User = await loadUserAdmin(university, 1);
        let profs: User[] = [];
        for (let i=1; i <= NUM_PROF; i++) {
            profs.push(await loadUserProf(transaction, university, i));
        }
        let courses: Course[] = [];
        for (let i=1; i <= NUM_PROF * NUM_COURSE_PER_PROF; i++) {
            courses.push(await loadCourse(transaction, university, curriculum, profs[(i-1) % NUM_PROF], i));
        }

        let totalStudentCount = 1;
        let courseCount = 0;
        for (let course of courses) {
            let students: User[] = [];
            for (let i=1; i <= NUM_STUDENT_PER_COURSE; i++) {
                students.push(await loadUserStudent(transaction, university, totalStudentCount));
                totalStudentCount++;
            }
            students.forEach(async (student) => {
                await loadStudentEnrollment(transaction, course, student);
            });

            let courseUnitContents: CourseUnitContent[] = [];
            for (let i=1; i <= NUM_UNIT_PER_COURSE; i++) {
                courseUnitContents.push(await loadCourseUnitContent(transaction, course, (courseCount * NUM_UNIT_PER_COURSE) + i));
            }

            let unitCount = 0;
            for (let courseUnitContent of courseUnitContents) {
                let courseTopicCount = unitCount * (NUM_HOMEWORK_PER_UNIT + NUM_ASSESSMENT_PER_UNIT) + 1;

                for (let j=1; j<= NUM_HOMEWORK_PER_UNIT; j++) {
                    let homework = await loadCourseTopicContent(transaction, course, courseUnitContent, topicTypes[0], courseTopicCount);
                    courseTopicCount++;

                    for (let k=1; k <= NUM_QUESTION_PER_TOPIC; k++) {
                        let question = await loadCourseTopicQuestion(transaction, homework, k);
                        for (let student of students) {
                            await loadStudentGrade(transaction, student, question);
                        }
                    }
                }
                for (let j=1; j <= NUM_ASSESSMENT_PER_UNIT; j++) {
                    let assessment = await loadCourseTopicContent(transaction, course, courseUnitContent, topicTypes[1], courseTopicCount);
                    let topicAssessmentInfo = await loadTopicAssessmentInfo(transaction, assessment);
                    courseTopicCount++;

                    for (let k=1; k <= NUM_QUESTION_PER_TOPIC; k++) {
                        let question = await loadCourseTopicQuestion(transaction, assessment, k);
                        for (let student of students) {
                            await loadStudentGrade(transaction, student, question);
                        }
                    }
                }
                unitCount++;
            };
            courseCount++;
        };

        await transaction.commit();

    } catch (e) {
        logger.error('Could not preload data: ', e);
        process.exit(-42);
    }
})();
