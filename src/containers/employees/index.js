import React, { Component } from 'react';
import ReactPaginate from 'react-paginate';
import './employee.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';

class App extends Component {
  constructor(props) {
    super(props);
    // Binding
    this.listEmployees = this.listEmployees.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleShowAdd = this.handleShowAdd.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.oneEmployee = this.oneEmployee.bind(this);
    this.handleStore = this.handleStore.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleJobTitleChange = this.handleJobTitleChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleDepartmentChange = this.handleDepartmentChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.loadDepartments = this.loadDepartments.bind(this);
    this.filterByJobTitle = this.filterByJobTitle.bind(this);
    this.filterByDepartment = this.filterByDepartment.bind(this);
    this.resetFilter = this.resetFilter.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

    // Initial States
    this.state = {
      data: [],
      employeeData: [],
      offset: 0,
      total: 0,
      subtotal: 0,
      employeeId: 0,
      employeeName: '',
      employeeTitle: '',
      employeeJobTitle: '',
      employeeImage: '',
      employeePhoneNumber: '',
      employeeEmail: '',
      employeeDepartmentId: '',
      departments: [],
      jobTitles: ['Administrative Assistant', 'Executive Assistant', 'Marketing Manager', 'Customer Service Representative', 'Nurse Practitioner', 'Software Engineer', 'Sales Manager', 'Data Entry Clerk', 'Office Assistant'],
      jobTitleFilter: '',
      filter: {
        search_term: '',
        job_title: '',
        department_id: '',
      },
      queryParams: '',
    };

    // Load Employees List
    this.listEmployees();

    // Load Departments List
    this.loadDepartments();
  }

  handleNameChange(event) {
    this.setState({ employeeName: event.target.value });
  }

  handleCountryChange(event) {
    this.setState({ employeeCountry: event.target.value });
  }

  handleJobTitleChange(event) {
    this.setState({ employeeJobTitle: event.target.value });
  }

  handlePhoneNumberChange(event) {
    this.setState({ employeePhoneNumber: event.target.value });
  }

  handleEmailChange(event) {
    this.setState({ employeeEmail: event.target.value });
  }

  handleTitleChange(event) {
    this.setState({ employeeTitle: event.target.value });
  }

  filterByJobTitle(event) {
    this.setState({ offset: 1, selected: 0 });
    this.state.filter.job_title = event.target.value;
    const queryParams = `&${Object.keys(this.state.filter).map((key) => `${key}=${this.state.filter[key]}`).join('&')}`;
    this.setState({ queryParams, selected: 0 }, () => {
      this.listEmployees();
    });
  }

  filterByDepartment(event) {
    this.setState({ offset: 1, selected: 0 });
    this.state.filter.department_id = event.target.value;
    const queryParams = `&${Object.keys(this.state.filter).map((key) => `${key}=${this.state.filter[key]}`).join('&')}`;
    this.setState({ queryParams, selected: 0 }, () => {
      this.listEmployees();
    });
  }

  handleSearch(event) {
    this.setState({ offset: 1, selected: 0 });
    this.state.filter.search_term = event.target.value;
    const queryParams = `&${Object.keys(this.state.filter).map((key) => `${key}=${this.state.filter[key]}`).join('&')}`;
    this.setState({ queryParams, selected: 0 }, () => {
      this.listEmployees();
    });
  }

  resetFilter() {
    this.state.filter = {
      search_term: '',
      job_title: '',
      department_id: '',
    };
    this.setState({ filter: this.state.filter, queryParams: '' }, () => {
      this.listEmployees();
    });
  }

  handleDepartmentChange(event) {
    this.setState({ employeeDepartmentId: event.target.value });
  }

  handleImageChange(event) {
    this.setState({ employeeImage: event.target.files[0] });
  }

  handleUpdate(e) {
    e.preventDefault();

    // let formData = new FormData();
    // formData.append('employee_id', this.state.employeeId);
    // formData.append('name', this.state.employeeName);
    // formData.append('country', this.state.employeeCountry);
    // formData.append('title', this.state.employeeTitle);
    // formData.append('job_title', this.state.employeeJobTitle);
    // formData.append('phone', this.state.employeePhoneNumber);
    // formData.append('email', this.state.employeeEmail);
    // formData.append('picture', this.state.employeeImage);
    // formData.append('department_id', this.state.employeeDepartmentId);

    fetch('http://localhost:8000/api/update-employee', {
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        employee_id: this.state.employeeId,
        name: this.state.employeeName,
        country: this.state.employeeCountry,
        title: this.state.employeeTitle,
        job_title: this.state.employeeJobTitle,
        phone: this.state.employeePhoneNumber,
        email: this.state.employeeEmail,
        department_id: this.state.employeeDepartmentId,
      }),
    }).then((res) => res.json()).then((response) => {
      if (response.status === 'failed') {
        alert(JSON.stringify(response.items));
      } else {
        this.setState({
          employeeId: response.id,
          employeeTitle: response.title,
          employeeName: response.name,
          employeeCountry: response.country,
          employeeJobTitle: response.job_title,
          employeePhoneNumber: response.phone,
          employeeEmail: response.email,
          employeeDepartmentId: response.department_id,
          // 'employeeImage': response.picture,
        });
        this.handleClose();
        this.listEmployees();
      }
    }).catch((error) => {
      console.log(error);
      console.log('Can’t access API response. Blocked by browser?');
    });
  }

  handleStore(e) {
    e.preventDefault();

    // let formData = new FormData();
    // formData.append('name', this.state.employeeName);
    // formData.append('title', this.state.employeeTitle);
    // formData.append('job_title', this.state.employeeJobTitle);
    // formData.append('phone', this.state.employeePhoneNumber);
    // formData.append('email', this.state.employeeEmail);
    // formData.append('picture', this.state.employeeImage);
    // formData.append('department_id', this.state.employeeDepartmentId);

    fetch('http://localhost:8000/api/add-employee', {
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        employee_id: this.state.employeeId,
        name: this.state.employeeName,
        country: this.state.employeeCountry,
        title: this.state.employeeTitle,
        job_title: this.state.employeeJobTitle,
        phone: this.state.employeePhoneNumber,
        email: this.state.employeeEmail,
        department_id: this.state.employeeDepartmentId,
      }),
    }).then((res) => res.json()).then((response) => {
      if (response.status === 'failed') {
        alert(JSON.stringify(response.items));
      } else {
        this.setState({
          employeeId: response.id,
          employeeTitle: response.title,
          employeeName: response.name,
          employeeJobTitle: response.job_title,
          employeePhoneNumber: response.phone,
          employeeEmail: response.email,
          employeeDepartmentId: response.department_id,
          employeeImage: response.picture,
        });
        this.handleClose();
        this.listEmployees();
      }
    }).catch((error) => {
      console.log(error);
      console.log('Can’t access API response. Blocked by browser?');
    });
  }

  handlePageClick(data) {
    const { selected } = data;
    const offset = Math.ceil(selected + 1);

    this.setState({ offset, selected }, () => {
      this.listEmployees();
    });
  }

  handleClose() {
    this.setState({
      show: false,
      showAdd: false,
    });
  }

  handleShow(e, data) {
    this.setState(
      {
        employeeId: data,
        show: true,
      },
      () => {
        this.oneEmployee(e);
      },
    );
  }

  handleDelete(e, data) {
    this.setState(
      {
        employeeId: data,
      },
      () => {
        this.deleteEmployee(e);
      },
    );
  }

  handleShowAdd() {
    this.setState(
      {
        showAdd: true,
      },
    );
  }

  listEmployees() {
    fetch(`http://localhost:8000/api/list-employees?page=${this.state.offset}${this.state.queryParams}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json()).then((response) => {
      this.setState({
        data: response.items,
        total: response.total,
        subtotal: response.items.length,
        pageCount: Math.ceil(response.total / 20),
      });
    }).catch((error) => {
      console.log(error);
      console.log('Can’t access API response. Blocked by browser?');
      localStorage.removeItem('token');
      this.setState({
        isLoggedIn: false,
      });
      this.props.history.push('/');
    });
  }

  oneEmployee() {
    fetch(`http://localhost:8000/api/get-employee-data/${this.state.employeeId}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json()).then((response) => {
      this.setState({
        employeeId: response.id,
        employeeTitle: response.title,
        employeeName: response.name,
        employeeJobTitle: response.job_title,
        employeePhoneNumber: response.phone,
        employeeEmail: response.email,
        employeeDepartmentId: response.department_id,
        employeeCountry: response.country,
        employeeImage: response.picture,
      });
    }).catch((error) => {
      console.log(error);
      console.log('Can’t access API response. Blocked by browser?');
    });
  }

  deleteEmployee() {
    fetch(`http://localhost:8000/api/delete-employee/${this.state.employeeId}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json()).then((response) => {
      this.setState({ offset: 1, selected: 0 });
      this.listEmployees();
    }).catch((error) => {
      console.log(error);
      console.log('Can’t access API response. Blocked by browser?');
    });
  }

  loadDepartments() {
    fetch('http://localhost:8000/api/list-all-departments', {
      method: 'GET',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json()).then((response) => {
      this.setState({
        departments: response,
      });
    }).catch((error) => {
      console.log(error);
      console.log('Can’t access API response. Blocked by browser?');
    });
  }

  render() {
    const employees = this.state.data.map((employee, key) => (
      <tr key={key}>
        <td><Image src={employee.picture} alt={employee.name} width="50px" rounded /></td>
        <td>{employee.name}</td>
        <td>{employee.country}</td>
        <td>{employee.job_title}</td>
        <td>{employee.email}</td>
        <td>{employee.phone}</td>
        <td>{employee.department.department_name}</td>
        <td>
          <button className="btn btn-warning" onClick={((e) => this.handleShow(e, employee.id))}>
            Edit
          </button>
        </td>
        <td>
          <button className="btn btn-danger" onClick={((e) => { if (window.confirm('Are you sure you want to delete this employee?')) { this.handleDelete(e, employee.id); } })}>
            Delete
          </button>
        </td>
      </tr>
    ));

    const departments = this.state.departments.map((department, key) => (
      <option
        value={department.id}
        key={key}
      >
        {department.name}
      </option>
    ));

    const jobTitles = this.state.jobTitles.map((jobTitle, key) => (
      <option
        value={jobTitle}
        key={key}
      >
        {jobTitle}
      </option>
    ));
    return (
      <div className="col-md-12">
        <div className="form-inline title">
          <h1>Employees</h1>
          <button className="btn btn-primary btn-add" onClick={((e) => this.handleShowAdd())}>
            Add Employee
          </button>
        </div>
        <div className="form-inline filters">
          <label>Search </label>
          <input type="text" name="term" placeholder="Search" onChange={this.handleSearch} />
          <label>Job Title</label>
          <select onChange={this.filterByJobTitle} className="jobFilter">
            {jobTitles}
          </select>
          <label>Department</label>
          <select onChange={this.filterByDepartment} className="departmentFilter">
            {departments}
          </select>
          <button className="btn btn-info btn-sm btn-filter" onClick={this.resetFilter}>Reset</button>
        </div>
        <div className="form-inline filters">
          <label>
            Showing &nbsp;
            <b>{this.state.subtotal}</b>
&nbsp; out of &nbsp;
            <b>{this.state.total}</b>
&nbsp; Employees
          </label>
        </div>
        <br />
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Country</th>
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
            previousLabel="Previous"
            previousClassName="page-link"
            nextClassName="page-link"
            nextLabel="Next"
            breakLabel="..."
            breakClassName="page-link"
            pageCount={this.state.pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.handlePageClick}
            containerClassName="pagination"
            subContainerClassName="pages pagination"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            activeClassName="active"
            forcePage={this.state.selected}
          />
        </nav>

        {/* Modal to Edit Employee */}
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Employee</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formGroupName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  onChange={this.handleNameChange}
                  value={this.state.employeeName || ''}
                />
              </Form.Group>
              <Form.Group controlId="formGroupName">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Country"
                  onChange={this.handleCountryChange}
                  value={this.state.employeeCountry || ''}
                />
              </Form.Group>
              <Form.Group controlId="formGroupOfficeManager">
                <Form.Label>Job Title</Form.Label>
                <Form.Control
                  as="select"
                  onChange={this.handleJobTitleChange}
                  value={this.state.employeeJobTitle || ''}
                >
                  {jobTitles}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formGroupOfficeNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Phone Number"
                  onChange={this.handlePhoneNumberChange}
                  value={this.state.employeePhoneNumber || ''}
                />
              </Form.Group>

              <Form.Group controlId="formGroupEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  onChange={this.handleEmailChange}
                  value={this.state.employeeEmail || ''}
                />
              </Form.Group>
              <Form.Group controlId="formGroupOfficeManager">
                <Form.Label>Department</Form.Label>
                <Form.Control
                  as="select"
                  onChange={this.handleDepartmentChange}
                  value={this.state.employeeDepartmentId || ''}
                >
                  {departments}
                </Form.Control>
              </Form.Group>
              {/* <Form.Group controlId="formGroupImage">
                                <Form.Label>Image</Form.Label>
                                <Form.Control type="file" onChange={this.handleImageChange}
                                    filename={this.state.employeeImage || ''}>
                                </Form.Control>
                            </Form.Group> */}
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
            <Modal.Title>Add Employee</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formGroupName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Name" onChange={this.handleNameChange} required />
              </Form.Group>
              <Form.Group controlId="formGroupName">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Country"
                  onChange={this.handleCountryChange}
                  value={this.state.employeeCountry || ''}
                />
              </Form.Group>
              <Form.Group controlId="formGroupOfficeManager">
                <Form.Label>Job Title</Form.Label>
                <Form.Control
                  as="select"
                  onChange={this.handleJobTitleChange}
                  value={this.state.employeeJobTitle || ''}
                >
                  {jobTitles}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formGroupOfficeNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Phone Number"
                  onChange={this.handlePhoneNumberChange}
                />
              </Form.Group>
              <Form.Group controlId="formGroupEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  onChange={this.handleEmailChange}
                />
              </Form.Group>
              <Form.Group controlId="formGroupOfficeManager">
                <Form.Label>Department</Form.Label>
                <Form.Control as="select" onChange={this.handleDepartmentChange}>
                  {departments}
                </Form.Control>
              </Form.Group>
              {/* <Form.Group controlId="formGroupImage">
                                <Form.Label>Image</Form.Label>
                                <Form.Control type="file" onChange={this.handleImageChange}>
                                </Form.Control>
                            </Form.Group> */}
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
    );
  }
}

export default App;
