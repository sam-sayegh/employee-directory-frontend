import React, {Component} from 'react'
import ReactPaginate from 'react-paginate';
import './department.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class App extends Component {
    constructor(props) {
        super(props);
        //Binding
        this.listDepartments = this.listDepartments.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleShowAdd = this.handleShowAdd.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.oneDepartment = this.oneDepartment.bind(this);
        this.handleStore = this.handleStore.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleOfficeNumberChange = this.handleOfficeNumberChange.bind(this);
        this.handleManagerChange = this.handleManagerChange.bind(this);
        this.loadManagers = this.loadManagers.bind(this);

        //Initial States
        this.state = {
            data: [],
            offset: 0,
            total: 0,
            departmentId: 0,
            departmentName: '',
            departmentDescription: '',
            departmentOfficeNumber: '',
            departmentManagerId: '',
            managers: [],
        };

        //Load Departments List
        this.listDepartments();
        //Load Managers List
        this.loadManagers();
    }

    handleNameChange(event) {
        this.setState({departmentName: event.target.value});
    }

    handleDescriptionChange(event) {
        this.setState({departmentDescription: event.target.value});
    }

    handleOfficeNumberChange(event) {
        this.setState({departmentOfficeNumber: event.target.value});
    }

    handleManagerChange(event) {
        this.setState({departmentManagerId: event.target.value});
    }

    handleUpdate(e) {
        e.preventDefault();
        fetch('http://localhost:8000/api/update-department', {
            method: "POST",
            mode: "cors",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                department_id: this.state.departmentId,
                name: this.state.departmentName,
                description: this.state.departmentDescription,
                office_number: this.state.departmentOfficeNumber,
                manager_id: this.state.departmentManagerId,
            })
        }).then(res => res.json()
        ).then(response => {
                if (response.status === 'failed') {
                    alert(JSON.stringify(response.items));
                } else {
                    this.setState({
                        'departmentName': response.name,
                        'departmentDescription': response.description,
                        'departmentOfficeNumber': response.office_number,
                        'departmentManagerId': response.manager_id,
                    });
                    this.handleClose();
                    this.listDepartments();
                }
            }
        ).catch(error => {
            console.log(error);
            console.log("Can’t access API response. Blocked by browser?");
        });
    };

    handleStore(e) {
        e.preventDefault();
        fetch('http://localhost:8000/api/add-department', {
            method: "POST",
            mode: "cors",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: this.state.departmentName,
                description: this.state.departmentDescription,
                office_number: this.state.departmentOfficeNumber,
                manager_id: this.state.departmentManagerId,
            })
        }).then(res => res.json()
        ).then(response => {
                if (response.status === 'failed') {
                    alert(JSON.stringify(response.items));
                } else {
                    this.setState({
                        'departmentName': response.name,
                        'departmentDescription': response.description,
                        'departmentOfficeNumber': response.office_number,
                        'departmentManagerId': response.manager_id,
                    });
                    this.handleClose();
                    this.listDepartments();
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

        this.setState({offset: offset, selected: selected}, () => {
            this.listDepartments();
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
                'departmentId': data,
                'show': true
            },
            () => {
                this.oneDepartment(e);

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

    listDepartments() {
        fetch('http://localhost:8000/api/list-departments?page=' + this.state.offset, {
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
                    'pageCount': Math.ceil(response.total / 20)
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

    oneDepartment() {
        fetch('http://localhost:8000/api/get-department-data/' + this.state.departmentId, {
            method: "GET",
            mode: "cors",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                "Content-Type": "application/json"
            }
        }).then(res => res.json()
        ).then(response => {
                this.setState({
                    'departmentName': response.name,
                    'departmentDescription': response.description,
                    'departmentOfficeNumber': response.office_number,
                    'departmentManagerId': response.manager_id,
                });
            }
        ).catch(error => {
            console.log(error);
            console.log("Can’t access API response. Blocked by browser?");
        });
    }

    loadManagers() {
        fetch('http://localhost:8000/api/load-managers', {
            method: "GET",
            mode: "cors",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                "Content-Type": "application/json"
            }
        }).then(res => res.json()
        ).then(response => {
                this.setState({
                    'managers': response
                });
            }
        ).catch(error => {
            console.log(error);
            console.log("Can’t access API response. Blocked by browser?");
        });
    }

    render() {
        const departments = this.state.data.map((department, key) =>
            <tr key={key}>
                <td>{department.name}</td>
                <td>{department.description}</td>
                <td>{department.office_number}</td>
                <td>{!!(department.employee) && !!(department.employee.manager_name)?department.employee.manager_name:""}</td>
                <td>
                    <button className={"btn btn-warning"} onClick={((e) => this.handleShow(e, department.id))}>
                        Edit
                    </button>
                </td>
            </tr>
        );

        const managers = this.state.managers.map((manager, key) =>
            <option
                key={key}
                value={manager.id}>{manager.name}</option>
        );

        const divStyleMinHeight = {
            'minHeight': '700px'
          };

        return (

            <div className="col-md-12">
                <div className={'form-inline title'}>
                    <h1>Departments</h1>
                    <button className={"btn btn-primary btn-add"} onClick={((e) => this.handleShowAdd())}>
                        Add
                    </button>
                </div>
                <br></br>
                <nav aria-label="Page navigation paginate">
                    <ReactPaginate
                        previousLabel={'Previous'}
                        previousClassName={'page-link'}
                        nextClassName={'page-link'}
                        nextLabel={'Next'}
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
                        forcePage={this.state.selected}
                    />
                </nav>
                <div style={divStyleMinHeight}>
                    <table className={"table table-striped"}>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Office Number</th>
                            <th>Manager</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {departments}
                        </tbody>
                    </table>
                </div>
                <nav aria-label="Page navigation paginate">
                    <ReactPaginate
                        previousLabel={'Previous'}
                        previousClassName={'page-link'}
                        nextClassName={'page-link'}
                        nextLabel={'Next'}
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
                        forcePage={this.state.selected}
                    />
                </nav>

                {/* Modal to Edit Department */}
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formGroupName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Name" onChange={this.handleNameChange}
                                              value={this.state.departmentName || ''}/>
                            </Form.Group>
                            <Form.Group controlId="formGroupDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" rows="3" placeholder="Description"
                                              onChange={this.handleDescriptionChange}
                                              value={this.state.departmentDescription || ''}/>
                            </Form.Group>
                            <Form.Group controlId="formGroupOfficeNumber">
                                <Form.Label>Office Number</Form.Label>
                                <Form.Control type="text" placeholder="Office Number"
                                              onChange={this.handleOfficeNumberChange}
                                              value={this.state.departmentOfficeNumber || ''}/>
                            </Form.Group>
                            <Form.Group controlId="formGroupOfficeManager">
                                <Form.Label>Manager</Form.Label>
                                <Form.Control as="select" onChange={this.handleManagerChange} value={this.state.departmentManagerId}>
                                    {managers}
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

                {/* Modal to Add Department */}
                <Modal show={this.state.showAdd} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formGroupName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Name" onChange={this.handleNameChange}/>
                            </Form.Group>
                            <Form.Group controlId="formGroupDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" rows="3" placeholder="Description"
                                              onChange={this.handleDescriptionChange}/>
                            </Form.Group>
                            <Form.Group controlId="formGroupOfficeNumber">
                                <Form.Label>Office Number</Form.Label>
                                <Form.Control type="text" placeholder="Office Number"
                                              onChange={this.handleOfficeNumberChange}/>
                            </Form.Group>
                            <Form.Group controlId="formGroupOfficeManager">
                                <Form.Label>Manager</Form.Label>
                                <Form.Control as="select" onChange={this.handleManagerChange}>
                                    {managers}
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
