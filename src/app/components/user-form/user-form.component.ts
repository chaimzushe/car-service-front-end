import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { subNavInfo } from 'src/app/models/car.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  roles = [
    {name: 'Mechanic'},
    {name: 'Admin'},
    {name: 'Manager'}
  ]
  subNavInfo: subNavInfo = {
    actionText: '',
    actionLink: [],
    backLink: '/users'
  }
  userId: any;
  userEditing: any;
  subscription: any = [];
  form: any;
  isSubmitting: any;
  constructor(private route: ActivatedRoute,
     private userService: UserService, private fb: FormBuilder,
     private snackbar: MatSnackBar,
     private router: Router) { }

  ngOnInit(): void {
    let routeSubscription = this.route.params.subscribe(async params => {
      this.userId = params.id !== 'new' && params.id;

      if (this.userId) {
        this.userEditing = await this.userService.getUserDetail(this.userId).toPromise();
      } else {
        this.userEditing = {};
      }
      this.setupForm(this.userEditing);
    });
    this.subscription.push(routeSubscription);
  }

  ngOnDestroy() {
    this.subscription.forEach(s => s.unsubscribe());
  }

  setupForm(user) {
    this.form = this.fb.group({
      name: [user.name, [Validators.required]],
      email: [user.email || 'N/A'],
      role: [user.role],
    });
  }

  async submit() {
    if (this.isSubmitting) { return; };
    this.isSubmitting = true;
    if (!this.form.valid) {
      this.snackbar.open("Please fix errors in the form", "Dismiss", { duration: 3000, panelClass: 'err-panel' })
      return this.isSubmitting = false;
    }
    if (this.userId) {
      try {
        let user = await this.userService.editUser(this.form.value, this.userId).toPromise();
        return this.afterSaveAction();
      } catch (e) {
        let sb = this.snackbar.open("Error saving", "Dismiss", { duration: 1000, panelClass: 'err-panel' });
        this.isSubmitting = false;
      }
    } else {
      try {
        let newUser = await this.userService.addUser(this.form.value).toPromise();


        return this.afterSaveAction();
      } catch (e) {
        let sb = this.snackbar.open("Error saving", "Dismiss", { duration: 1000, panelClass: 'err-panel' });
        this.isSubmitting = false;
      }
    }

  }
  afterSaveAction() {
    let sb = this.snackbar.open("User successfully saved", "Dismiss", { duration: 1000 });
    sb.afterDismissed().subscribe(x => {
      this.isSubmitting = false;
      this.router.navigate(['/users']);
    })
  }


}
