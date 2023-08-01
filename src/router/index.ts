import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from "@/views/LoginView.vue";
import Login from '../views/Login/Login.vue';
import BackgroundHome from '../views/Background/BackgroundHome.vue'
import BackgroundLogin from '../views/Background/BackgroundLogin.vue'

const router = createRouter({
        history: createWebHistory(import.meta.env.BASE_URL),
        routes: [
            {
                path: '/home',
                name: 'home',
                component: HomeView,
                redirect: '/home/questionnaireCenter',
                children: [{
                    path: '/home/questionnaireCenter',
                    name: 'questionnaireCenter',
                    component: () => import('../views/HomePageView/QuestionnaireCenter.vue'),
                }, {
                    path: '/home/questionnaireCenter/answer',
                    name: 'answer',
                    component: () => import('../views/QuestionCenter/Answer.vue'),
                }, {
                    path: '/home/publishQuestionnaire',
                    name: 'publishQuestionnaire',
                    component: () => import('../views/HomePageView/PublishQuestionnaire.vue'),
                    redirect: '/home/publishQuestionnaire/LookTemplate',
                    children: [{
                        path: '/home/publishQuestionnaire/LookTemplate',
                        name: 'LookTemplate',
                        component: () => import('../views/PublishQuestion/LookTemplate.vue'),
                    }, {
                        path: '/home/publishQuestionnaire/QuestionCreat',
                        name: 'QuestionCreat',
                        component: () => import('../views/PublishQuestion/QuestionCreat.vue'),
                    }, {
                        path: '/home/publishQuestionnaire/TemplatePreview',
                        name: 'TemplatePreview',
                        component: () => import('../views/PublishQuestion/TemplatePreview.vue')
                    }, {
                        path: '/home/publishQuestionnaire/TemplateRevise',
                        name: 'TemplateRevise',
                        component: () => import('../views/PublishQuestion/TemplateRevise.vue')
                    },

                    ]
                }, {
                    path: '/home/myQuestionnaire',
                    name: 'myQuestionnaire',
                    component: () => import('../views/HomePageView/MyQuestionnaire.vue'),
                }, {
                    path: '/home/myQuestionnaire/preview',
                    name: 'preview',
                    component: () => import('../views/MyQuestion/Preview.vue'),
                }, {
                    path: '/home/myQuestionnaire/revise',
                    name: 'revise',
                    component: () => import('../views/MyQuestion/Revise.vue'),
                },{
                    path: '/home/myQuestionnaire/AnswerPreview',
                    name: 'AnswerPreview',
                    component: () => import('../views/MyQuestion/AnalyseAnswerPreview.vue'),
                },
                ]
            }, {
                path: '/home/myQuestionnaire/analyse',
                name: 'analyse',
                component: () => import('../views/MyQuestion/Analyse.vue'),
            },  {
                path: '/personal',
                name: 'personal',
                component: () => import('../views/PersonalView.vue'),
                redirect: '/personal/personalCenter/personalInformation',
                children: [
                    {
                        path: '/personal/personalCenter/personalInformation',
                        name: 'personalInformation',
                        component: () => import('../views/Personal/son/personalInformation.vue'),
                    }, {
                        path: '/personal/personalCenter/historicalAnswers',
                        name: 'historicalAnswers',
                        component: () => import('../views/Personal/son/historicalAnswers.vue'),
                    }, {
                        path: '/personal/personalCenter/changePassword',
                        name: 'changePassword',
                        component: () => import('../views/Personal/son/changePassword.vue'),
                    },
                ]
            }, {
                path: '/login',
                name: 'login',
                redirect: '/',
                component: LoginView,
                children: [{
                    path: '/',
                    name: 'login',
                    component: Login,
                }, {
                    path: '/enroll',
                    name: 'enroll',
                    component: () => import('../views/Login/Enroll.vue')
                },
                ]
            }, {
                path: '/personal/personalCenter/historicalAnswers/personalAnswer',
                name: 'personalAnswer',
                component: () => import('../views/Personal/PersonalAnswer.vue')
            },


            {
                path: '/BackgroundPreview',
                name: 'BackgroundPreview',
                component: () => import('../views/Background/BackgroundPreview.vue')
            }, {
                path: '/BackgroundTemplatePreview',
                name: 'BackgroundTemplatePreview',
                component: () => import('../views/Background/BackgroundTemplatePreview.vue')
            },
            {
                path: '/BackgroundLogin',
                name: 'BackgroundLogin',
                component: BackgroundLogin,
            },
            {
                path: '/background',
                name: 'background',
                component: () => import('../views/Background/ManageView.vue'),
                redirect: '/BackgroundData',
                children: [{
                    path: '/background/home',
                    name: 'backgroundUser',
                    component: BackgroundHome
                }, {
                    path: '/user',
                    name: 'backgroundUser',
                    component: () => import('../views/Background/User.vue')
                }, {
                    path: '/administrator',
                    name: 'backgroundAdministrator',
                    component: () => import('../views/Background/Administrator.vue')
                }, {
                    path: '/backgroundSurvey',
                    name: 'backgroundSurvey',
                    component: () => import('../views/Background/BackgroundSurvey.vue')
                }, {
                    path: '/backgroundSurveyTemplate',
                    name: 'backgroundSurveyTemplate',
                    component: () => import('../views/Background/BackgroundSurveyTemplate.vue')
                }, {
                    path: '/Template',
                    name: 'Template',
                    component: () => import('../views/Background/Template.vue')
                }, {
                    path: '/BackgroundData',
                    name: 'BackgroundData',
                    component: () => import('../views/Background/BackgroundData.vue')
                }
                ]
            },
        ]
    }
)
export default router
