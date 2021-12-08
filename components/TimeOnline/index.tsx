import HighchartsReact from 'highcharts-react-official';
import Highcharts, { color } from 'highcharts';
import { Grid } from '@mui/material';
import './style.scss'
import { Course } from '../../sub_modules/share/model/courses';
import AvatarUser from '../../public/images/icons/default_avatar_otsv.jpg'
import { UserInfo } from '../../sub_modules/share/model/user';
import IconEditUser from '../../public/images/icons/icon-edit-user.svg'
import IconFeedbackUser from '../../public/images/icons/icon-feedback-user.svg'
import IconRecentTest from '../../public/images/icons/iconRecentTest.svg'
import IconActivityRecent from '../../public/images/icons/IconActivityrecent.svg'
import { RelatedCourse } from '../RelatedCourse';
import { Fragment, useEffect, useState } from 'react';
import { apiGetMyCourses } from '../../utils/apis/courseApi';
import UserActivityItem from '../CourseDetail/UserActivityItem';
import { UserActivity } from '../../sub_modules/share/model/userActivity';
import { apiGetUserActivitiesByCourse } from '../../utils/apis/userActivityApi';
export const TimeOnline = (props: { course: Course, user: UserInfo }) => {
    const { course, user } = props
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        apiGetMyCourses(user._id)
            .then((userCourses) => {
                setCourses(userCourses.map((uc) => uc.course));
            })
    }, [])
    useEffect(() => {
        apiGetUserActivitiesByCourse({ courseId: course._id })
          .then((data) => setUserActivities(data));
      }, []);
    const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
    return (
        <Grid container>
            <Grid item md={8}>
                <div className="wraper-panel-chart">
                    <div className="header-left-chart">
                        <i className="far fa-stopwatch"></i>
                        <span>Thời lượng online</span>
                        <div className="col-left_"></div>
                        <div className="col-right_">Thống kê</div>
                    </div>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={{
                            chart: {
                                type: 'column'
                            },
                            title: {
                                text: ''
                            },
                            subtitle: {
                                text: ''
                            },
                            accessibility: {
                                announceNewData: {
                                    enabled: false,
                                }
                            },
                            xAxis: {
                                type: 'text + 1'
                            },
                            yAxis: {
                                title: {
                                    text: ''
                                }

                            },
                            legend: {
                                enabled: false
                            },
                            plotOptions: {
                                series: {
                                    borderWidth: 0,
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.y:.1f}%'
                                    }
                                }
                            },

                            tooltip: {
                                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
                            },

                            series: [
                                {
                                    name: "Browsers",
                                    colorByPoint: false,
                                    data: [
                                        {
                                            name: "Chrome",
                                            y: 62.74,
                                            drilldown: "Chrome"
                                        },
                                        {
                                            name: "Firefox",
                                            y: 10.57,
                                            drilldown: "Firefox"
                                        },
                                        {
                                            name: "Internet Explorer",
                                            y: 7.23,
                                            drilldown: "Internet Explorer"
                                        },
                                        {
                                            name: "Safari",
                                            y: 5.58,
                                            drilldown: "Safari"
                                        },
                                        {
                                            name: "Edge",
                                            y: 4.02,
                                            drilldown: "Edge"
                                        },
                                        {
                                            name: "Opera",
                                            y: 1.92,
                                            drilldown: "Opera"
                                        },
                                        {
                                            name: "Other",
                                            y: 7.62,
                                            drilldown: null
                                        }
                                    ]
                                }
                            ],
                            drilldown: {
                                series: [
                                    {
                                        name: "Chrome",
                                        id: "Chrome",
                                        data: [
                                            [
                                                "v65.0",
                                                0.1
                                            ],
                                            [
                                                "v64.0",
                                                1.3
                                            ],
                                            [
                                                "v63.0",
                                                53.02
                                            ],
                                            [
                                                "v62.0",
                                                1.4
                                            ],
                                            [
                                                "v61.0",
                                                0.88
                                            ],
                                            [
                                                "v60.0",
                                                0.56
                                            ],
                                            [
                                                "v59.0",
                                                0.45
                                            ],
                                            [
                                                "v58.0",
                                                0.49
                                            ],
                                            [
                                                "v57.0",
                                                0.32
                                            ],
                                            [
                                                "v56.0",
                                                0.29
                                            ],
                                            [
                                                "v55.0",
                                                0.79
                                            ],
                                            [
                                                "v54.0",
                                                0.18
                                            ],
                                            [
                                                "v51.0",
                                                0.13
                                            ],
                                            [
                                                "v49.0",
                                                2.16
                                            ],
                                            [
                                                "v48.0",
                                                0.13
                                            ],
                                            [
                                                "v47.0",
                                                0.11
                                            ],
                                            [
                                                "v43.0",
                                                0.17
                                            ],
                                            [
                                                "v29.0",
                                                0.26
                                            ]
                                        ]
                                    },
                                    {
                                        name: "Firefox",
                                        id: "Firefox",
                                        data: [
                                            [
                                                "v58.0",
                                                1.02
                                            ],
                                            [
                                                "v57.0",
                                                7.36
                                            ],
                                            [
                                                "v56.0",
                                                0.35
                                            ],
                                            [
                                                "v55.0",
                                                0.11
                                            ],
                                            [
                                                "v54.0",
                                                0.1
                                            ],
                                            [
                                                "v52.0",
                                                0.95
                                            ],
                                            [
                                                "v51.0",
                                                0.15
                                            ],
                                            [
                                                "v50.0",
                                                0.1
                                            ],
                                            [
                                                "v48.0",
                                                0.31
                                            ],
                                            [
                                                "v47.0",
                                                0.12
                                            ]
                                        ]
                                    },
                                    {
                                        name: "Internet Explorer",
                                        id: "Internet Explorer",
                                        data: [
                                            [
                                                "v11.0",
                                                6.2
                                            ],
                                            [
                                                "v10.0",
                                                0.29
                                            ],
                                            [
                                                "v9.0",
                                                0.27
                                            ],
                                            [
                                                "v8.0",
                                                0.47
                                            ]
                                        ]
                                    },
                                    {
                                        name: "Safari",
                                        id: "Safari",
                                        data: [
                                            [
                                                "v11.0",
                                                3.39
                                            ],
                                            [
                                                "v10.1",
                                                0.96
                                            ],
                                            [
                                                "v10.0",
                                                0.36
                                            ],
                                            [
                                                "v9.1",
                                                0.54
                                            ],
                                            [
                                                "v9.0",
                                                0.13
                                            ],
                                            [
                                                "v5.1",
                                                0.2
                                            ]
                                        ]
                                    },
                                    {
                                        name: "Edge",
                                        id: "Edge",
                                        data: [
                                            [
                                                "v16",
                                                2.6
                                            ],
                                            [
                                                "v15",
                                                0.92
                                            ],
                                            [
                                                "v14",
                                                0.4
                                            ],
                                            [
                                                "v13",
                                                0.1
                                            ]
                                        ]
                                    },
                                    {
                                        name: "Opera",
                                        id: "Opera",
                                        data: [
                                            [
                                                "v50.0",
                                                0.96
                                            ],
                                            [
                                                "v49.0",
                                                0.82
                                            ],
                                            [
                                                "v12.1",
                                                0.14
                                            ]
                                        ]
                                    }
                                ]
                            }
                        }}
                    />
                </div>
                <div className="chart-recent-test">
                    <div className="title-recent-test">
                         <span><img src={IconRecentTest} alt="IconRecentTest"/></span>
                        <span>Bài Kiểm Tra Gần Đây</span>
                        <div className="col-left_"></div>
                    </div>
                    <div className="item-chart_">
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={{
                            chart: {
                                type: 'column'
                            },
                            title: {
                                text: ''
                            },
                            subtitle: {
                                text: ''
                            },
                            accessibility: {
                                announceNewData: {
                                    enabled: false,
                                }
                            },
                            xAxis: {
                                type: 'text + 1'
                            },
                            yAxis: {
                                title: {
                                    text: ''
                                }

                            },
                            legend: {
                                enabled: false
                            },
                            plotOptions: {
                                series: {
                                    borderWidth: 0,
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.y:.1f}%'
                                    }
                                }
                            },

                            tooltip: {
                                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
                            },

                            series: [
                                {
                                    name: "Browsers",
                                    colorByPoint: false,
                                    data: [
                                        {
                                            name: "Chrome",
                                            y: 62.74,
                                            drilldown: "Chrome"
                                        },
                                        {
                                            name: "Firefox",
                                            y: 10.57,
                                            drilldown: "Firefox"
                                        },
                                        {
                                            name: "Internet Explorer",
                                            y: 7.23,
                                            drilldown: "Internet Explorer"
                                        },
                                        {
                                            name: "Safari",
                                            y: 5.58,
                                            drilldown: "Safari"
                                        },
                                        {
                                            name: "Edge",
                                            y: 4.02,
                                            drilldown: "Edge"
                                        },
                                        {
                                            name: "Opera",
                                            y: 1.92,
                                            drilldown: "Opera"
                                        },
                                        {
                                            name: "Other",
                                            y: 7.62,
                                            drilldown: null
                                        }
                                    ]
                                }
                            ],
                            drilldown: {
                                series: [
                                    {
                                        name: "Chrome",
                                        id: "Chrome",
                                        data: [
                                            [
                                                "v65.0",
                                                0.1
                                            ],
                                            [
                                                "v64.0",
                                                1.3
                                            ],
                                            [
                                                "v63.0",
                                                53.02
                                            ],
                                            [
                                                "v62.0",
                                                1.4
                                            ],
                                            [
                                                "v61.0",
                                                0.88
                                            ],
                                            [
                                                "v60.0",
                                                0.56
                                            ],
                                            [
                                                "v59.0",
                                                0.45
                                            ],
                                            [
                                                "v58.0",
                                                0.49
                                            ],
                                            [
                                                "v57.0",
                                                0.32
                                            ],
                                            [
                                                "v56.0",
                                                0.29
                                            ],
                                            [
                                                "v55.0",
                                                0.79
                                            ],
                                            [
                                                "v54.0",
                                                0.18
                                            ],
                                            [
                                                "v51.0",
                                                0.13
                                            ],
                                            [
                                                "v49.0",
                                                2.16
                                            ],
                                            [
                                                "v48.0",
                                                0.13
                                            ],
                                            [
                                                "v47.0",
                                                0.11
                                            ],
                                            [
                                                "v43.0",
                                                0.17
                                            ],
                                            [
                                                "v29.0",
                                                0.26
                                            ]
                                        ]
                                    },
                                    {
                                        name: "Firefox",
                                        id: "Firefox",
                                        data: [
                                            [
                                                "v58.0",
                                                1.02
                                            ],
                                            [
                                                "v57.0",
                                                7.36
                                            ],
                                            [
                                                "v56.0",
                                                0.35
                                            ],
                                            [
                                                "v55.0",
                                                0.11
                                            ],
                                            [
                                                "v54.0",
                                                0.1
                                            ],
                                            [
                                                "v52.0",
                                                0.95
                                            ],
                                            [
                                                "v51.0",
                                                0.15
                                            ],
                                            [
                                                "v50.0",
                                                0.1
                                            ],
                                            [
                                                "v48.0",
                                                0.31
                                            ],
                                            [
                                                "v47.0",
                                                0.12
                                            ]
                                        ]
                                    },
                                    {
                                        name: "Internet Explorer",
                                        id: "Internet Explorer",
                                        data: [
                                            [
                                                "v11.0",
                                                6.2
                                            ],
                                            [
                                                "v10.0",
                                                0.29
                                            ],
                                            [
                                                "v9.0",
                                                0.27
                                            ],
                                            [
                                                "v8.0",
                                                0.47
                                            ]
                                        ]
                                    },
                                    {
                                        name: "Safari",
                                        id: "Safari",
                                        data: [
                                            [
                                                "v11.0",
                                                3.39
                                            ],
                                            [
                                                "v10.1",
                                                0.96
                                            ],
                                            [
                                                "v10.0",
                                                0.36
                                            ],
                                            [
                                                "v9.1",
                                                0.54
                                            ],
                                            [
                                                "v9.0",
                                                0.13
                                            ],
                                            [
                                                "v5.1",
                                                0.2
                                            ]
                                        ]
                                    },
                                    {
                                        name: "Edge",
                                        id: "Edge",
                                        data: [
                                            [
                                                "v16",
                                                2.6
                                            ],
                                            [
                                                "v15",
                                                0.92
                                            ],
                                            [
                                                "v14",
                                                0.4
                                            ],
                                            [
                                                "v13",
                                                0.1
                                            ]
                                        ]
                                    },
                                    {
                                        name: "Opera",
                                        id: "Opera",
                                        data: [
                                            [
                                                "v50.0",
                                                0.96
                                            ],
                                            [
                                                "v49.0",
                                                0.82
                                            ],
                                            [
                                                "v12.1",
                                                0.14
                                            ]
                                        ]
                                    }
                                ]
                            }
                        }}
                    />
                    </div>
                </div>
                <div className="activity-recent">
                    <div className="header-left-activity">
                     <img src={IconActivityRecent} alt="IconActivityRecent"/>
                        <span>Hoạt động gần đây</span>
                        <div className="col-left_"></div>
                    </div>
                    <div>
                    {!!userActivities.length && userActivities.map((e) => (
                    <Fragment key={e._id}>
                        <UserActivityItem activity={e} />
                    </Fragment>
                    ))}
                    </div>
                </div>
            </Grid>
            <Grid className="inf-user-profile" item md={4}>
                <div className="wraper__">
                    <div className="block-userInfo">
                        <div className="avatar-user">
                            <img src={user?.avatar || AvatarUser} alt="avatar" />
                        </div>
                        <div className="name-user">
                            {user?.name || 'name Fake'}
                        </div>
                        <div className="email-user">
                            {user?.email || 'abcxyz@gmail.com'}
                        </div>
                        <div className="utilities-user">
                            <div className="edit-inf item-utilities"><img src={IconEditUser} />Sửa thông tin</div>
                            <div className="feedback item-utilities"> <img src={IconFeedbackUser} />Phản hồi</div>
                        </div>
                    </div>
                    <div>
                        <RelatedCourse courses={courses} user={user} />
                    </div>
                </div>
            </Grid>
        </Grid>
    )
}