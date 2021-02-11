import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { subNavInfo } from 'src/app/models/car.model';
import { BayService } from 'src/app/services/bay.service';

@Component({
  selector: 'app-bay-form',
  templateUrl: './bay-form.component.html',
  styleUrls: ['./bay-form.component.scss']
})
export class BayFormComponent implements OnInit {

  subNavInfo: subNavInfo = {
    actionText: '',
    actionLink: [],
    backLink: '/bays'
  }
  bayId: any;
  bayEditing: any;
  subscription: any = [];
  form: any;
  isSubmitting: any;

  constructor(private route: ActivatedRoute,
    private bayService: BayService, private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {
    let routeSubscription = this.route.params.subscribe(async params => {
      this.bayId = params.id !== 'new' && params.id;

      if (this.bayId) {
        this.bayEditing = await this.bayService.getBayDetail(this.bayId).toPromise();
      } else {
        this.bayEditing = {};
      }
      this.setupForm(this.bayEditing);
    });
    this.subscription.push(routeSubscription);
  }

  ngOnDestroy() {
    this.subscription.forEach(s => s.unsubscribe());
  }

  setupForm(bay) {
    this.form = this.fb.group({
      name: [bay.name, [Validators.required]],
      number: [bay.number, [Validators.required]],
      capacity: [bay.capacity],
    });
  }

  async submit() {
    if (this.isSubmitting) { return; };
    this.isSubmitting = true;
    if (!this.form.valid) {
      this.snackbar.open("Please fix errors in the form", "Dismiss", { duration: 3000, panelClass: 'err-panel' })
      return this.isSubmitting = false;
    }
    if (this.bayId) {
      try {
        let bay = await this.bayService.editBay(this.form.value, this.bayId).toPromise();
        return this.afterSaveAction();
      } catch (e) {
        let sb = this.snackbar.open("Error saving", "Dismiss", { duration: 1000, panelClass: 'err-panel' });
        this.isSubmitting = false;
      }
    } else {
      try {
        let newBay = await this.bayService.addBay(this.form.value).toPromise();
        return this.afterSaveAction();
      } catch (e) {
        let sb = this.snackbar.open("Error saving", "Dismiss", { duration: 1000, panelClass: 'err-panel' });
        this.isSubmitting = false;
      }
    }

  }
  afterSaveAction() {
    let sb = this.snackbar.open("Bay successfully saved", "Dismiss", { duration: 1000 });
    sb.afterDismissed().subscribe(x => {
      this.isSubmitting = false;
      this.router.navigate(['/bays']);
    })
  }

}
