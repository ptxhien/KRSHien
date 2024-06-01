import {Card, CardTitle, Col, Row, Button} from 'reactstrap';
import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faClock,
    faDollarSign,
    faLaptopHouse,
    faMapMarked,
} from "@fortawesome/free-solid-svg-icons";
import Chip from "../Commons/Chip";
import {AiOutlineHeart} from "react-icons/all";

function ListRecruit() {
    const listJobs = [
        {
            id: 1,
            title: "PHP Developer (Laravel, MySQL)",
            company: {
                name: "VNJ",
                logo: "https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMjh3REE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--fb2bb0d27dc4aeeb521ea4fde8beb8c641d0db46/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBPZ2wzWldKd09oSnlaWE5wZW1WZmRHOWZabWwwV3dkcEFhb3ciLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--bb0ebae071595ab1791dc0ad640ef70a76504047/vnj-logo.jpg"
            },
            form: "Hybrid",
            place: "Hồ Chí Minh",
            technical: ["PHP", "Laravel", "MySQL"],
            salary: "Thỏa thuận",
            time: "2 ngày trước"
        },
        {
            id: 2,
            title: "Senior Game Server Engineer (PHP, Unity, Node.js)",
            company: {
                name: "Công ty TNHH Thankslab Việt Nam",
                logo: "https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBemIwS1E9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--b4546ebdb5164bd5335439ca4fafd004ae64e411/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBPZ2wzWldKd09oSnlaWE5wZW1WZmRHOWZabWwwV3dkcGFXbHAiLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--20b0435834affc851fb8b496383cefc8135158a8/logo.png"
            },
            form: "At office",
            place: "Hà Nội",
            technical: ["PHP", "NodeJS", "Unity"],
            salary: "15 - 30 triệu",
            time: "3 ngày trước"
        },
        {
            id: 3,
            title: "PHP Developer (Laravel, OOP)",
            company: {
                name: "Công ty TNHH GUTA Việt Nam",
                logo: "https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBN090UWc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--fde85faf87efb5f5baba2d2b531d517dd600ecf6/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBPZ2wzWldKd09oSnlaWE5wZW1WZmRHOWZabWwwV3dkcGFXbHAiLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--20b0435834affc851fb8b496383cefc8135158a8/9625-200x200.jpg"
            },
            form: "At office",
            place: "Hà Nội",
            technical: ["PHP", "OOP", "Laravel"],
            salary: "15 - 30 triệu",
            time: "1 ngày trước"
        },
        {
            id: 4,
            title: "PHP Developer (Laravel, MySQL)",
            company: {
                name: "VNJ",
                logo: "https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMjh3REE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--fb2bb0d27dc4aeeb521ea4fde8beb8c641d0db46/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBPZ2wzWldKd09oSnlaWE5wZW1WZmRHOWZabWwwV3dkcEFhb3ciLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--bb0ebae071595ab1791dc0ad640ef70a76504047/vnj-logo.jpg"
            },
            form: "Hybrid",
            place: "Hồ Chí Minh",
            technical: ["PHP", "Laravel", "MySQL"],
            salary: "Thỏa thuận",
            time: "2 ngày trước"
        },
        {
            id: 5,
            title: "Senior Game Server Engineer (PHP, Unity, Node.js)",
            company: {
                name: "Công ty TNHH Thankslab Việt Nam",
                logo: "https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBemIwS1E9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--b4546ebdb5164bd5335439ca4fafd004ae64e411/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBPZ2wzWldKd09oSnlaWE5wZW1WZmRHOWZabWwwV3dkcGFXbHAiLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--20b0435834affc851fb8b496383cefc8135158a8/logo.png"
            },
            form: "At office",
            place: "Hà Nội",
            technical: ["PHP", "NodeJS", "Unity"],
            salary: "15 - 30 triệu",
            time: "2 ngày trước"
        },
        {
            id: 6,
            title: "PHP Developer (Laravel, OOP)",
            company: {
                name: "Công ty TNHH GUTA Việt Nam",
                logo: "https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBN090UWc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--fde85faf87efb5f5baba2d2b531d517dd600ecf6/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBPZ2wzWldKd09oSnlaWE5wZW1WZmRHOWZabWwwV3dkcGFXbHAiLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--20b0435834affc851fb8b496383cefc8135158a8/9625-200x200.jpg"
            },
            form: "At office",
            place: "Hà Nội",
            technical: ["PHP", "OOP", "Laravel"],
            salary: "15 - 30 triệu",
            time: "2 ngày trước"
        }
    ];
    const [job, setJob] = useState(listJobs[0]);
    const setJobDetail = (job) => {
        // call api get detail job here
        const jobDetail = {
            ...job,
            address: "118 Nguyễn Minh Hoàng, Phường 12, Tan Binh, Ho Chi Minh",
            time: "20 days ago",
            topReasons: [
              "Bonus, Review lương 2 lần/ năm",
              "Đi Nhật training miễn phí",
              "Bảo hiểm, du lịch hấp dẫn"
            ],
            description: "We are looking for PHP Developer( Laravel, MySQL) to join our project. The services we provide are all client facing, so a high attention to usability and customer satisfaction is expected. If you want to work closely with a team, drive ideas to completion, and be a core member who creates our next-generation software services, then contact us.\n" +
                "\n" +
                "RESPONSIBILITIES INCLUDE:\n" +
                "\n" +
                "Developing Web Application System based on Laravel, ReactJS, VueJS, MySQL.\n" +
                "Analyze functional requirements and creation of Web System .\n" +
                "Developing web system for Japanese customers.",
            requirement: [
                "Have at least 1 year experience in PHP,Laravel, JavaScript, MySQL, JS",
                "Have knowledge of framework such as  ReactJs, VueJS, Tailwind ...",
                "High sense of responsibility",
                "Ability to learn and adopt new technologies quickly",
                "Teamwork skills, working under high pressure.",
                "Willing to work and become the core member of company"
            ],
            benefits: [
                "Opportunity to move up to Manager positions.",
                "Attractive Salary",
                "Friendly, dynamic, diversified and promoted working environment",
                "Attractive bonus and compensation: 13th-month bonus.",
                "The chance to attend the professional training courses.",
                "Can remote work 2 days a week base on ability and attitude."
            ]
        }
        setJob(jobDetail);
        console.log('setJob', job)
    };

    useEffect(() => {
        setJobDetail(listJobs[0])
    }, []);

    return (
        <Row>
            <Col sm={12}>
                <h4 className="font-weight-bold position-relative" style={{top: '10px'}}>{listJobs.length} công việc</h4>
            </Col>
            <Col md={5}>
                { listJobs.map((item, index) => (
                    <div className="my-3 position-relative">
                        <Card key={index} className={"p-4" + (job.id === item.id ? " active-card" : " ")} onClick={() => setJobDetail(item)}>
                            <CardTitle className="font-size-lg">
                                {item.title}
                            </CardTitle>
                            <div className="d-flex align-items-center">
                                <img src={item.company.logo} alt="company logo" height="50" width="50" style={{objectFit: "contain"}} className="border"/>
                                <div className="ml-2">
                                    {item.company.name}
                                </div>
                            </div>
                            <div className="d-flex align-items-center font-size-md text-success font-weight-bold mt-2">
                                <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                                { item.salary }
                            </div>
                            <div>
                                <hr className=""/>
                            </div>
                            <div>
                                <div className="d-flex align-items-center mt-1">
                                    <FontAwesomeIcon icon={faLaptopHouse} className="mr-2" />
                                    { item.form }
                                </div>
                                <div className="d-flex align-items-center mt-1">
                                    <FontAwesomeIcon icon={faMapMarked} className="mr-2" />
                                    { item.place }
                                </div>
                                <Row className="d-flex align-items-center pl-2 mt-1">
                                    { item.technical.map((tech, index) => (
                                        <Chip color="#1663ba" text={tech} key={index} />
                                    ))}
                                </Row>
                            </div>
                        </Card>
                    </div>
                )) }
            </Col>
            <Col md={7}>
                <Card className="my-3 p-3 recruit">
                    <div className="d-flex">
                        <img src={job.company.logo} alt="logo" width="80" height="80" style={{objectFit: "contain"}} className="border mr-3" />
                        <div>
                            <h4 className="font-weight-bold text-black mb-0">{job.title}</h4>
                            <div>{job.company.name}</div>
                            <div className="d-flex align-items-center font-size-md text-success font-weight-bold mt-1">
                                <FontAwesomeIcon icon={faDollarSign} className="mr-2"/>
                                {job.salary}
                            </div>
                        </div>
                    </div>
                    <div className="mt-2 d-flex align-items-center">
                        <Button className="w-100" color="primary">Ứng tuyển ngay</Button>
                        <AiOutlineHeart style={{fontSize: '32px'}} className="mx-2 text-primary"/>
                    </div>
                    <hr />
                    <div className="recruit-detail">
                        <div>
                            <div className="d-flex align-items-center my-1">
                                <FontAwesomeIcon icon={faMapMarked} className="mr-2"/>
                                {job.address}
                            </div>
                            <div className="d-flex align-items-center my-1">
                                <FontAwesomeIcon icon={faLaptopHouse} className="mr-2"/>
                                {job.form}
                            </div>
                            <div className="d-flex align-items-center my-1">
                                <FontAwesomeIcon icon={faClock} className="mr-2"/>
                                {job.time}
                            </div>
                            <div className="d-flex align-items-center my-1">
                                <span className="mr-3">Skills:</span>
                                <Row className="d-flex align-items-center pl-2 mt-1">
                                    {job.technical.map((tech, index) => (
                                        <Chip color="#1663ba" text={tech} key={index}/>
                                    ))}
                                </Row>
                            </div>
                        </div>
                        <hr style={{borderTop: "dashed 1px #cfcfcf"}}/>
                        <div>
                            <h5 className="font-weight-bold">Top 3 lý do nên tham gia cùng chúng tôi</h5>
                            {job.topReasons && job.topReasons.map((item, index) => (
                                <li key={index} className="text-primary my-1">
                                    <span style={{ color: "black"}}>{item}</span>
                                </li>
                            ))}
                        </div>
                        <hr style={{borderTop: "dashed 1px #cfcfcf"}}/>
                        <div>
                            <h5 className="font-weight-bold">Mô tả công việc</h5>
                            {job.description}
                        </div>
                        <hr style={{borderTop: "dashed 1px #cfcfcf"}}/>
                        <div>
                            <h5 className="font-weight-bold">Yêu cầu kỹ năng và kinh nghiệm</h5>
                            {job.requirement && job.requirement.map((item, index) => (
                                <li key={index} className="text-primary my-1">
                                    <span style={{ color: "black"}}>{item}</span>
                                </li>
                            ))}
                        </div>
                        <hr style={{borderTop: "dashed 1px #cfcfcf"}}/>
                        <div>
                            <h5 className="font-weight-bold">Mô tả công việc</h5>
                            {job.benefits && job.benefits.map((item, index) => (
                                <li key={index} className="text-primary my-1">
                                    <span style={{ color: "black"}}>{item}</span>
                                </li>
                            ))}
                        </div>
                    </div>
                </Card>
            </Col>
        </Row>
    )
}

export default ListRecruit;
