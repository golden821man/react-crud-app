import React, { Component } from 'react';
import Swal from 'sweetalert2';
import { EMPLOYEES_DATA } from '../constants/employeesData';

import Header from './Header';
import DataTable from './DataTable';
import AddForm from './AddForm';
import EditForm from './EditForm';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      employeesData: EMPLOYEES_DATA,
      firstName: '',
      lastName: '',
      email: '',
      salary: '',
      date: '',
      addClicked: false,
      editeClicked: false,
      selectedEmployee: null
    };

    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.onAddSuccess = this.onAddSuccess.bind(this);
    this.onUpdateSuccess = this.onUpdateSuccess.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  onAddSuccess(employeesData) {
    this.setState({
      employeesData,
      addClicked: false
    });
  }

  handleDelete(id) {
    const { employeesData } = this.state;

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        const x = employeesData.filter(employee => employee.id === id);

        Swal.fire({
          position: 'center',
          type: 'success',
          title: 'Deleted!',
          text: `${x[0].firstName} ${x[0].lastName} has been deleted.`,
          showConfirmButton: false,
          timer: 1500
        });

        const updatedList = employeesData.filter(
          employee => employee.id !== id
        );

        // console.log(updatedList);
        this.setState({ employeesData: updatedList });
      }
    });
  }

  handleLogout() {
    Swal.fire({
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, log me out!',
      cancelButtonText: 'No, keep me in'
    }).then(result => {
      if (result.value) {
        Swal.fire({
          timer: 1500,
          onBeforeOpen: () => {
            Swal.showLoading();
          },
          onClose: () => {
            this.props.onLogoutSuccess();
          }
        });
      }
    });
  }

  handleAddClick() {
    this.setState({ addClicked: true });
  }

  handleEditClick(id) {
    const result = this.state.employeesData.filter(
      employee => employee.id === id
    );
    const employee = result[0];

    this.setState({ editeClicked: true, selectedEmployee: employee });
  }

  onUpdateSuccess(id, employeeData) {
    const { employeesData } = this.state;

    employeesData.map((employee, i) => {
      id === employee.id
        ? employeesData.splice(i, 1, employeeData)
        : Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Something went wrong!'
          });
      return false;
    });
    this.setState({
      employeesData,
      editeClicked: false
    });
    Swal.fire({
      position: 'center',
      type: 'success',
      title: `${employeeData.firstName} ${employeeData.lastName} data updated.`,
      showConfirmButton: false,
      timer: 1500
    });

    // console.log(this.state.employeesData);
  }

  render() {
    const {
      employeesData,
      addClicked,
      editeClicked,
      selectedEmployee
    } = this.state;

    return (
      <div className="container">
        {!addClicked && !editeClicked && (
          <Header
            handleAddClick={this.handleAddClick}
            handleLogout={this.handleLogout}
          />
        )}
        {!addClicked && !editeClicked && (
          <DataTable
            employeesData={employeesData}
            handleEditClick={this.handleEditClick}
            handleDelete={this.handleDelete}
          />
        )}
        {addClicked && (
          <AddForm
            employeesData={employeesData}
            onAddSuccess={this.onAddSuccess}
          />
        )}
        {editeClicked && (
          <EditForm
            selectedEmployee={selectedEmployee}
            onUpdateSuccess={this.onUpdateSuccess}
          />
        )}
      </div>
    );
  }
}

export default Dashboard;
