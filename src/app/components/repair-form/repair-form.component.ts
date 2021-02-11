import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { subNavInfo } from 'src/app/models/car.model';
import { RepairService } from 'src/app/services/repair.service';

@Component({
  selector: 'app-repair-form',
  templateUrl: './repair-form.component.html',
  styleUrls: ['./repair-form.component.scss']
})
export class RepairFormComponent implements OnInit, OnDestroy {
  subNavInfo: subNavInfo = {
    actionText: '',
    actionLink: [],
    backLink: '/repair-options'
  }
  repairId: any;
  repairEditing: any;
  subscription: any = [];
  form: any;
  isSubmitting: any;
  visitTypes = ['Maintenance', 'Accident', 'Inspection', 'TLC Other', 'Scheduled'];
  constructor(private route: ActivatedRoute,
    private repairService: RepairService, private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {
    let routeSubscription = this.route.params.subscribe(async params => {
      this.repairId = params.id !== 'new' && params.id;

      if (this.repairId) {
        this.repairEditing = await this.repairService.getRepairDetail(this.repairId).toPromise();
      } else {
        this.repairEditing = {};
      }
      this.setupForm(this.repairEditing);
    });
    this.subscription.push(routeSubscription);
  }

  ngOnDestroy() {
    this.subscription.forEach(s => s.unsubscribe());
  }

  setupForm(repair) {
    this.form = this.fb.group({
      name: [repair.name, [Validators.required]],
      intervalCheck: [repair.intervalCheck],
      checkWhenMilageIsAt: [repair.checkWhenMilageIsAt],
      forVisit: [repair.forVisit],
      price: [repair.price],
      showLastPerformed: [repair.showLastPerformed || false],
      active: [repair.active]
    });
  }

  async submit() {
    if (this.isSubmitting) { return; };
    this.isSubmitting = true;
    if (!this.form.valid) {
      this.snackbar.open("Please fix errors in the form", "Dismiss", { duration: 3000, panelClass: 'err-panel' })
      return this.isSubmitting = false;
    }
    if (this.repairId) {
      try {
        let repair = await this.repairService.editRepair(this.form.value, this.repairId).toPromise();
        return this.afterSaveAction();
      } catch (e) {
        let sb = this.snackbar.open("Error saving", "Dismiss", { duration: 1000, panelClass: 'err-panel' });
        this.isSubmitting = false;
      }
    } else {
      try {
        let newRepair = await this.repairService.addRepair(this.form.value).toPromise();


        return this.afterSaveAction();
      } catch (e) {
        let sb = this.snackbar.open("Error saving", "Dismiss", { duration: 1000, panelClass: 'err-panel' });
        this.isSubmitting = false;
      }
    }

  }
  afterSaveAction() {
    let sb = this.snackbar.open("Repair successfully saved", "Dismiss", { duration: 1000 });
    sb.afterDismissed().subscribe(x => {
      this.isSubmitting = false;
      this.router.navigate(['/repair-options']);
    })
  }

}
