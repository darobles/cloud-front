import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { User } from '../../../../shared/interfaces/user';
import { UserService } from '../../../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../services/auth-service.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements AfterViewInit {
  @Output() userCreated = new EventEmitter<void>();

  newUser: User = {
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
    role_id: 0,
  };
  
  @ViewChild('addUserModal') modalElement!: ElementRef;
  modalInstance!: bootstrap.Modal;
  isAdmin: boolean = false;

  constructor(private userService: UserService,private authService: AuthService) {}

  ngAfterViewInit() {
    if (typeof document !== 'undefined' && this.modalElement?.nativeElement) {
      this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
    }
  }

  open() {
    this.authService.getCurrentUser().subscribe(user => {
      console.log('AddUserComponent.open() currentUser:', user);
      this.isAdmin = !!user && user.role_id === 1;

    }
    );

    this.modalInstance.show();
  }

  close() {
    this.modalInstance.hide();
  }

  addUser() {
    console.log('AddUserComponent.addUser() this.newUser:', this.newUser);
    this.userService.addUser(this.newUser).subscribe(() => {
      this.userCreated.emit();
      this.close();
    });
  }
}
