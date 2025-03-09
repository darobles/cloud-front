import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { User } from '../../../shared/interfaces/user';
import { AddUserComponent } from '../modals/add-user/add-user.component';
import { EditUserComponent } from '../modals/edit-user/edit-user.component';
import { ToastComponent } from '../../shared/toast/toast.component';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, EditUserComponent, AddUserComponent, ToastComponent],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedUser: User = {
    id: 0,
    username: '',
    password: '',
    name: '',
    email: '',
    address: '',
    post: '',
    city: '',
    country: '',
    role: '',
    role_id: 0
  };
  searchTerm: string = '';

  @ViewChild('editUserModal') editUserModal!: EditUserComponent;
  @ViewChild('addUserModal') addUserModal!: AddUserComponent;

  constructor(private userService: UserService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((data: User[]) => {
      console.log('load user:', data);
      this.users = data;
      this.filteredUsers = data;
    });
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => user.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  openEditUserModal(user: User): void {
    this.selectedUser = { ...user };
    this.editUserModal.open();
  }

  openAddUserModal(): void {
    this.addUserModal.open();
  }

  deleteUser(user: User): void {
    this.userService.deleteUser(user.id).subscribe(() => {
      this.loadUsers();
      this.toastService.show('Success', 'User has been deleted successfully!', 'danger');

    });
  }

  showToast(): void {
    this.toastService.show('Success', 'User has been created successfully!', 'success');
  }
}
