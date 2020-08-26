import React, {Component} from 'react'
import ReactPaginate from 'react-paginate';
import './employee.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';

class App extends Component {
    constructor(props) {
        super(props);
        //Binding
        this.listEmployees = this.listEmployees.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleShowAdd = this.handleShowAdd.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.oneEmployee = this.oneEmployee.bind(this);
        this.handleStore = this.handleStore.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleJobTitleChange = this.handleJobTitleChange.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleDepartmentChange = this.handleDepartmentChange.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.loadDepartments = this.loadDepartments.bind(this);
        this.loadJobTitles = this.loadJobTitles.bind(this);
        this.filterByJobTitle = this.filterByJobTitle.bind(this);
        this.filterByDepartment = this.filterByDepartment.bind(this);
        this.resetFilter = this.resetFilter.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

        //Initial States
        this.state = {
            data: [],
            employeeData: [],
            offset: 0,
            total: 0,
            employeeId: 0,
            employeeName: '',
            employeeTitle: '',
            employeeJobTitle: '',
            employeeImage: '',
            employeePhoneNumber: '',
            employeeEmail: '',
            employeeDepartmentId: '',
            departments: [],
            jobTitles: [],
            jobTitleFilter: '',
            filter: '',
        };

        //Load Employees List
        this.listEmployees();

        //Load Departments List
        this.loadDepartments();

        //Load Departments List
        this.loadJobTitles();
    }

    handleNameChange(event) {
        this.setState({employeeName: event.target.value});
    }

    handleJobTitleChange(event) {
        this.setState({employeeJobTitle: event.target.value});
    }

    handlePhoneNumberChange(event) {
        this.setState({employeePhoneNumber: event.target.value});
    }

    handleEmailChange(event) {
        this.setState({employeeEmail: event.target.value});
    }

    handleTitleChange(event) {
        this.setState({employeeTitle: event.target.value});
    }

    filterByJobTitle(event) {
        this.setState({offset: 1, filter: ''});
        this.setState({filter: this.state.filter + '&job_title=' + event.target.value}, () => {
            this.listEmployees();
        });
    }

    filterByDepartment(event) {
        this.setState({offset: 1, filter: ''});
        this.setState({filter: this.state.filter + '&department_id=' + event.target.value}, () => {
            this.listEmployees();
        });
    }

    handleSearch(event) {
        this.setState({filter: this.state.filter + '&term=' + event.target.value}, () => {
            this.listEmployees();
        });
    }

    resetFilter() {
        this.setState({filter: ''}, () => {
            this.listEmployees();
        });
    }

    handleDepartmentChange(event) {
        this.setState({employeeDepartmentId: event.target.value});
    }

    handleImageChange = event => {
        this.setState({employeeImage: event.target.files[0]})
    }

    handleUpdate(e) {
        e.preventDefault();

        let formData = new FormData();
        formData.append('employee_id', this.state.employeeId);
        formData.append('name', this.state.employeeName);
        formData.append('title', this.state.employeeTitle);
        formData.append('job_title', this.state.employeeJobTitle);
        formData.append('phone_number', this.state.employeePhoneNumber);
        formData.append('email', this.state.employeeEmail);
        formData.append('image', this.state.employeeImage);
        formData.append('department_id', this.state.employeeDepartmentId);

        fetch('http://localhost:8000/employees/update', {
            method: "POST",
            mode: "cors",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            body: formData
        }).then(res => res.json()
        ).then(response => {
                if (response.status === 'failed') {
                    alert(JSON.stringify(response.items));
                } else {
                    this.setState({
                        'employeeId': response.id,
                        'employeeTitle': response.title,
                        'employeeName': response.name,
                        'employeeJobTitle': response.job_title,
                        'employeePhoneNumber': response.phone_number,
                        'employeeEmail': response.email,
                        'employeeDepartmentId': response.department_id,
                        'employeeImage': response.image,
                    });
                    this.handleClose();
                    this.listEmployees();
                }

            }
        ).catch(error => {
            console.log(error);
            console.log("Can’t access API response. Blocked by browser?");
        });
    };

    handleStore(e) {
        e.preventDefault();

        let formData = new FormData();
        formData.append('name', this.state.employeeName);
        formData.append('title', this.state.employeeTitle);
        formData.append('job_title', this.state.employeeJobTitle);
        formData.append('phone_number', this.state.employeePhoneNumber);
        formData.append('email', this.state.employeeEmail);
        formData.append('image', this.state.employeeImage);
        formData.append('department_id', this.state.employeeDepartmentId);

        fetch('http://localhost:8000/employees/store', {
            method: "POST",
            mode: "cors",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            body: formData
        }).then(res => res.json()
        ).then(response => {
                if (response.status === 'failed') {
                    alert(JSON.stringify(response.items));
                } else {
                    this.setState({
                        'employeeId': response.id,
                        'employeeTitle': response.title,
                        'employeeName': response.name,
                        'employeeJobTitle': response.job_title,
                        'employeePhoneNumber': response.phone_number,
                        'employeeEmail': response.email,
                        'employeeDepartmentId': response.department_id,
                        'employeeImage': response.image,
                    });
                    this.handleClose();
                    this.listEmployees();
                }
            }
        ).catch(error => {
            console.log(error);
            console.log("Can’t access API response. Blocked by browser?");
        });
    };

    handlePageClick = data => {
        let selected = data.selected;
        let offset = Math.ceil(selected + 1);

        this.setState({offset: offset}, () => {
            this.listEmployees();
        });
    };

    handleClose() {
        this.setState({
            show: false,
            showAdd: false
        });
    }

    handleShow = (e, data) => {
        this.setState(
            {
                'employeeId': data,
                'show': true
            },
            () => {
                this.oneEmployee(e);

            }
        );
    };

    handleShowAdd = () => {
        this.setState(
            {
                'showAdd': true
            }
        );
    };

    listEmployees() {
        fetch('http://localhost:8000/employees/list?per_page=50&page=' + this.state.offset + this.state.filter, {
            method: "GET",
            mode: "cors",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                "Content-Type": "application/json"
            }
        }).then(res => res.json()
        ).then(response => {
                this.setState({
                    'data': response.items,
                    'total': response.total,
                    'pageCount': Math.ceil(response.total / 50)
                });
            }
        ).catch(error => {
            console.log(error);
            console.log("Can’t access API response. Blocked by browser?");
            localStorage.removeItem('token');
            this.setState({
                'isLoggedIn': false
            });
            this.props.history.push('/');
        });
    }

    oneEmployee() {
        fetch('http://localhost:8000/employees/one/' + this.state.employeeId, {
            method: "GET",
            mode: "cors",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                "Content-Type": "application/json"
            }
        }).then(res => res.json()
        ).then(response => {
                this.setState({
                    'employeeId': response.id,
                    'employeeTitle': response.title,
                    'employeeName': response.name,
                    'employeeJobTitle': response.job_title,
                    'employeePhoneNumber': response.phone_number,
                    'employeeEmail': response.email,
                    'employeeDepartmentId': response.department_id,
                    'employeeImage': response.image,
                });
            }
        ).catch(error => {
            console.log(error);
            console.log("Can’t access API response. Blocked by browser?");
        });
    }

    loadDepartments() {
        fetch('http://localhost:8000/departments/list?per_page=500', {
            method: "GET",
            mode: "cors",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                "Content-Type": "application/json"
            }
        }).then(res => res.json()
        ).then(response => {
                this.setState({
                    'departments': response.items
                });
            }
        ).catch(error => {
            console.log(error);
            console.log("Can’t access API response. Blocked by browser?");
        });
    }

    loadJobTitles() {
        fetch('http://localhost:8000/employees/job-titles', {
            method: "GET",
            mode: "cors",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                "Content-Type": "application/json"
            }
        }).then(res => res.json()
        ).then(response => {
                this.setState({
                    'jobTitles': response
                });
            }
        ).catch(error => {
            console.log(error);
            console.log("Can’t access API response. Blocked by browser?");
        });
    }


    render() {
        const employees = this.state.data.map((employee, key) =>
            <tr key={key}>
                <td><Image src={employee.image} alt={employee.name} width={'50px'} rounded/></td>
                <td>{employee.title} {employee.name}</td>
                <td>{employee.job_title}</td>
                <td>{employee.email}</td>
                <td>{employee.phone_number}</td>
                <td>{employee.department.name}</td>
                <td>
                    <button className={"btn btn-warning"} onClick={((e) => this.handleShow(e, employee.id))}>
                        Edit
                    </button>
                </td>
            </tr>
        );

        const departments = this.state.departments.map((department, key) =>
            <option
                value={department.id}
                key={key}>{department.name}</option>
        );

        const jobTitles = this.state.jobTitles.map((jobTitle, key) =>
            <option
                value={jobTitle}
                key={key}>{jobTitle}</option>
        );
        return (
            <div>
                <div className={'form-inline title'}>
                    <h1>Employees</h1>
                    <button className={"btn btn-primary btn-add"} onClick={((e) => this.handleShowAdd())}>
                        Add
                    </button>
                </div>
                <div className={'form-inline filters'}>
                    <label>Search </label>
                    <input type={'text'} name={'term'} placeholder={'Search'} onChange={this.handleSearch}/>
                    <label>Job Title</label>
                    <select onChange={this.filterByJobTitle} className={'jobFilter'}>
                        {jobTitles}
                    </select>
                    <label>Department</label>
                    <select onChange={this.filterByDepartment} className={'departmentFilter'}>
                        {departments}
                    </select>
                    <button className={'btn btn-info btn-sm btn-filter'} onClick={this.resetFilter}>reset</button>
                </div>
                <table className={"table table-striped"}>
                    <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Job Title</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Department</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {employees}
                    </tbody>
                </table>
                <nav aria-label="Page navigation paginate">
                    <ReactPaginate
                        previousLabel={'previous'}
                        previousClassName={'page-link'}
                        nextClassName={'page-link'}
                        nextLabel={'next'}
                        breakLabel={'...'}
                        breakClassName={'page-link'}
                        pageCount={this.state.pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        pageClassName={'page-item'}
                        pageLinkClassName={'page-link'}
                        activeClassName={'active'}
                    />
                </nav>

                {/* Modal to Edit Employee */}
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formGroupName">
                                <Form.Label>Title</Form.Label>
                                <Form.Control as="select" onChange={this.handleTitleChange}
                                              value={this.state.employeeTitle}>
                                    <option value={'Dr.'} key={1}>Dr.
                                    </option>
                                    <option value={'Mr.'} key={2}>Mr.
                                    </option>
                                    <option value={'Prof.'} key={3}>Prof.
                                    </option>
                                    <option value={'Ms.'} key={4}>Ms.
                                    </option>
                                    <option value={'Miss'} key={5}>Miss
                                    </option>
                                    <option value={'Mrs.'} key={6}>Mrs.
                                    </option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formGroupName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Name" onChange={this.handleNameChange}
                                              value={this.state.employeeName || ''}/>
                            </Form.Group>
                            <Form.Group controlId="formGroupDescription">
                                <Form.Label>Job Title</Form.Label>
                                <Form.Control type="text" placeholder="Job Title" onChange={this.handleJobTitleChange}
                                              value={this.state.employeeJobTitle || ''}/>
                            </Form.Group>
                            <Form.Group controlId="formGroupOfficeNumber">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control type="text" placeholder="Phone Number"
                                              onChange={this.handlePhoneNumberChange}
                                              value={this.state.employeePhoneNumber || ''}/>
                            </Form.Group>

                            <Form.Group controlId="formGroupEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Email"
                                              onChange={this.handleEmailChange}
                                              value={this.state.employeeEmail || ''}/>
                            </Form.Group>
                            <Form.Group controlId="formGroupOfficeManager">
                                <Form.Label>Manager</Form.Label>
                                <Form.Control as="select" onChange={this.handleDepartmentChange}
                                              value={this.state.employeeDepartmentId || ''}>
                                    {departments}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formGroupImage">
                                <Form.Label>Image</Form.Label>
                                <Form.Control type="file" onChange={this.handleImageChange}
                                              filename={this.state.employeeImage || ''}>
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.handleUpdate}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal to Add Employee */}
                <Modal show={this.state.showAdd} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formGroupName">
                                <Form.Label>Title</Form.Label>
                                <Form.Control as="select" onChange={this.handleTitleChange} value={'Dr.'} required>
                                    <option value={'Dr.'} key={1}>Dr.</option>
                                    <option value={'Mr.'} key={2}>Mr.</option>
                                    <option value={'Prof.'} key={3}>Prof.</option>
                                    <option value={'Ms.'} key={4}>Ms.</option>
                                    <option value={'Miss'} key={5}>Miss</option>
                                    <option value={'Mrs.'} key={6}>Mrs.</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formGroupName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Name" onChange={this.handleNameChange} required/>
                            </Form.Group>
                            <Form.Group controlId="formGroupDescription">
                                <Form.Label>Job Title</Form.Label>
                                <Form.Control type="text" placeholder="Job Title" onChange={this.handleJobTitleChange}/>
                            </Form.Group>
                            <Form.Group controlId="formGroupOfficeNumber">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control type="text" placeholder="Phone Number"
                                              onChange={this.handlePhoneNumberChange}/>
                            </Form.Group>

                            <Form.Group controlId="formGroupEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Email"
                                              onChange={this.handleEmailChange}/>
                            </Form.Group>
                            <Form.Group controlId="formGroupOfficeManager">
                                <Form.Label>Manager</Form.Label>
                                <Form.Control as="select" onChange={this.handleDepartmentChange}>
                                    {departments}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formGroupImage">
                                <Form.Label>Image</Form.Label>
                                <Form.Control type="file" onChange={this.handleImageChange}>
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.handleStore}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default App
