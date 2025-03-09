import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { User } from '../../../../shared/interfaces/user';
import { UserService } from '../../../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements AfterViewInit {
  @Input() user!: User;
  @ViewChild('editUserModal') modalElement!: ElementRef;
  modalInstance!: bootstrap.Modal;

  constructor(private userService: UserService) {}

  ngAfterViewInit() {
    if (typeof document !== 'undefined' && this.modalElement?.nativeElement) {
      this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
    }
  }

  open() {
    this.modalInstance.show();
  }

  close() {
    this.modalInstance.hide();
  }

  updateUser() {
    this.userService.updateUser(this.user).subscribe(() => {
      this.close();
    });
  }
}
