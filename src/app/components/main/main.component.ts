import { Component, signal, model } from '@angular/core';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, Validators, AbstractControl, ValidationErrors, FormGroup, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";

/**
 * The MainComponent is a standalone component that handles form validation for an email and password input field.
 * It provides real-time error messages for invalid inputs and allows for controlled visibility of the password field.
 */
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    MatCardModule, MatCheckboxModule, FormsModule, MatRadioModule,
    HeaderComponent,
    FooterComponent
],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {


  /**
   * Controls the visibility of the password input field.
   * A signal-based mechanism allows reactive state management for the hide flag.
   */
  hide = signal(true);

  /**
   * Form control for the password input field with validation to ensure a value is entered.
   */
  password = new FormControl('', [Validators.required]);

  /**
   * Tracks whether a checkbox is checked or not, using a signal-based model.
   */
  readonly checked = model(false);

  /**
   * Form control for the email input field with validation for both required field and proper email format.
   */
  readonly email = new FormControl('', [Validators.required, Validators.email]);


  /**
   * Signal to store and update error messages based on the email input validation.
   */
  errorMessage = signal('');


  /**
   * Constructor initializes the component and sets up reactive form validation to display error messages dynamically.
   */
  constructor() {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }


  /**
   * Updates the error message for the email field based on its validation status.
   */
  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }


  /**
   * Returns the appropriate error message for the email input field based on its validation state.
   * @returns Error message for required or invalid email input.
   */
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
}
