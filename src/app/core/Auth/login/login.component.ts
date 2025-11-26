import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoginserviceService } from './loginservice.service';
import { Router } from '@angular/router';

import { EncryptionService } from '../../encryptionservice/encryption.service';
import { CookieService } from 'ngx-cookie-service';
declare var $: any;
declare const setFocusOnNextElement: any;
import 'select2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, AfterViewInit {
  IsInquiryPopup: boolean = false;
  isAboutShown: boolean = false;
  isFAQShown: boolean = false;

  loginForm!: FormGroup;
  isPasswordVisible = false;
  loadingDR = false;
  isLoginFormShow = true;
  isFormShow = false;
  departmentBranch: any[] = [];

  companyName: any;
  logo: any = localStorage.getItem('companyLogoMain');

  @ViewChild('inputName0') inputName0: any = ElementRef;
  @ViewChild('inputName1') inputName1: any = ElementRef;
  @ViewChild('inputName2') inputName2: any = ElementRef;
  @ViewChild('inputName3') inputName3: any = ElementRef;

  // 🔹 Inquiry Popup ViewChild
  @ViewChild('orgInput') orgInput!: ElementRef;
  @ViewChild('addrInput') addrInput!: ElementRef;
  @ViewChild('contactInput') contactInput!: ElementRef;
  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('natureSelect') natureSelect!: ElementRef;
  @ViewChild('remarksInput') remarksInput!: ElementRef;
  @ViewChild('submitBtn') submitBtn!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    public loginservice: LoginserviceService,
    private router: Router,
    private el: ElementRef,
    private encrypt: EncryptionService,
    private cookieService: CookieService
  ) {
    this.loginForm = this.fb.group({
      CompanyCode: ['', Validators.required],
      username1: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  ngOnInit(): void {
    //For remember me
    const remember = this.cookieService.get('rememberMe');
    if (remember === 'true') {
      const username = this.cookieService.get('username') || '';
      const companyCode = this.cookieService.get('companyCode') || '';

      this.loginForm.patchValue({
        username1: username,
        CompanyCode: companyCode,
        rememberMe: true,
      });
    }
  }

  ngAfterViewInit(): void {
    this.selectCompanyBranch();
    this.bannerSlider();

    // Initialize all select2 dropdowns
    $(this.el.nativeElement).find('select').select2();

    // Initialize Select2 for Nature field ONLY
    if (this.natureSelect) {
      const selectEl = $(this.natureSelect.nativeElement);

      // Initialize Select2
      selectEl.select2({
        placeholder: '--Choose--',
        width: '100%',
      });

      // When selecting → Focus Remarks field
      selectEl.on('select2:select', () => {
        this.remarksInput.nativeElement.focus();
      });

      // When dropdown closes →  Focus Remarks field
      selectEl.on('select2:close', () => {
        setTimeout(() => {
            this.remarksInput.nativeElement.focus();
        }, 0);
      });
    }

    // Enter key navigation for text fields
    const inquiryInputs = [
      this.orgInput,
      this.addrInput,
      this.contactInput,
      this.emailInput,
    ];

    inquiryInputs.forEach((elRef, idx) => {
      if (elRef) {
        elRef.nativeElement.addEventListener('keyup', (e: KeyboardEvent) => {
          if (e.key === 'Enter') {
            e.preventDefault();

            if (inquiryInputs[idx + 1]) {
              // Go to next input
              inquiryInputs[idx + 1].nativeElement.focus();
            } else {
              // Last text input → open Select2
              $(this.natureSelect.nativeElement).select2('open');
            }
          }
        });
      }
    });

    // Remarks → Enter → submit button
    if (this.remarksInput) {
      this.remarksInput.nativeElement.addEventListener(
        'keydown',
        (e: KeyboardEvent) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.submitBtn.nativeElement.focus(); // 👈 First focus
            //  this.submitBtn.nativeElement.click(); // 👈 Then auto-submit
          }
        }
      );
    }
    // Handle Select2 Close event
  }

  bannerSlider() {
    $('#slick-slider').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
      dots: false,
      arrows: false,
      responsive: [{ breakpoint: 768, settings: { slidesToShow: 1 } }],
    });
  }

  selectCompanyBranch() {
    if (this.departmentBranch.length === 1) {
      const singleBranch = this.departmentBranch[0];
      localStorage.setItem('branch', singleBranch.branch_Id);
      localStorage.setItem('branchDepartment', singleBranch.branchDepartment);
      this.router.navigate(['/dashboard']);
    } else {
      const selectElement = $(this.el.nativeElement).find('select').select2();
      selectElement.on('change', (event: any) => {
        const branchId = event.target.value;

        if (branchId) {
          const selectedBranch = this.departmentBranch.find(
            (branch: any) => branch.branch_Id == branchId
          );

          if (selectedBranch) {
            localStorage.setItem('branch', branchId);
            localStorage.setItem(
              'branchDepartment',
              selectedBranch.branchDepartment
            );
            this.router.navigate(['/dashboard']);
          }
        }
      });
    }
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  publoginsubmit() {
    this.loadingDR = true;
    let validation = true;
    const { CompanyCode, username1, password, rememberMe } =
      this.loginForm.value;

    if (!CompanyCode) {
      this.toastr.error('Company Code Required');
      validation = false;
      this.inputName0.nativeElement.focus();
    } else if (!username1) {
      this.toastr.error('Username Required');
      validation = false;
      this.inputName1.nativeElement.focus();
    } else if (!password) {
      this.toastr.error('Password Required');
      validation = false;
      this.inputName2.nativeElement.focus();
    }

    if (!validation) return;

    const objData = {
      name: username1,
      password: password,
      databseId: CompanyCode,
      ipAddress: '0.0.0.0',
      macAddress: '0-0-0-0-0-0',
      hostAddress: '-',
    };

    this.loginservice.Login(objData).subscribe({
      next: (data: any) => {
        this.loadingDR = false;
        const code = data?.authResult?.code;

        if (code == 200) {
          this.departmentBranch = data.departmentBranches;
          this.companyName = data.ownerCompanyList.companyName;

          this.isLoginFormShow = false;
          this.isFormShow = true;

          const encryptedtoken = this.encrypt.encryptionAES(data?.ptoken);
          this.loginservice.setToken(encryptedtoken);

          localStorage.setItem('systemInfo', JSON.stringify(data.systemInfo));
          localStorage.setItem(
            'fiscalYear',
            JSON.stringify(data.fiscalYearInfo)
          );
          localStorage.setItem(
            'globalVariable',
            JSON.stringify(data.globalVariable)
          );
          localStorage.setItem('otherInfo', JSON.stringify(data.otherInfo));
          localStorage.setItem(
            'companyInfo',
            JSON.stringify(data.ownerCompanyList)
          );
          localStorage.setItem('userInfo', JSON.stringify(data.userReturn));
          localStorage.setItem('allMenu', JSON.stringify(data.menu));
          localStorage.setItem('userId', data.userReturn.intUserId);
          localStorage.setItem('sessionId', data.userReturn.sessionId);
          localStorage.setItem(
            'companyLogoMain',
            'data:image/jpeg;base64,' + data.logo
          );

          if (rememberMe) {
            this.cookieService.set('rememberMe', 'true');
            this.cookieService.set('username', username1);
            this.cookieService.set('companyCode', CompanyCode);
          } else {
            this.cookieService.delete('rememberMe');
            this.cookieService.delete('username');
            this.cookieService.delete('companyCode');
          }
        } else {
          this.toastr.error('Invalid Credentials');
        }
      },
      error: (error) => {
        this.loadingDR = false;
        this.isLoginFormShow = true;
        this.isFormShow = false;
        console.log(error,"error");
        this.toastr.error('Failed to login');

        
      },
    });
  }

  event1(e: any, recinput: any, nextinput: any) {
    if (e.key === 'Enter') {
      if (!recinput.value) {
        recinput.focus();
        this.toastr.error(`${recinput.id.replace(/([A-Z])/g, ' $1')} Required`);
      } else {
        nextinput.focus();
      }
    }
  }

  //=======================================================================================================
  // Inquiry Popup
  InquiryPopup() {
    this.IsInquiryPopup = true;
  }

  closeInquiryPopup() {
    this.IsInquiryPopup = false;
  }

  Inquirysubmit() {
    this.loadingDR = true;
    // Run validation first
    if (this.ValidationInquiry()) {
      this.loadingDR = false;
      // 🔹 Gather values from inputs
      const objData = {
        inquiryId: 0,
        organizationName: this.orgInput.nativeElement.value,
        address: this.addrInput.nativeElement.value,
        contact: this.contactInput.nativeElement.value,
        email: this.emailInput.nativeElement.value,
        nature: $('#Nature').val(),
        remarks: this.remarksInput.nativeElement.value,
        inquiryDateTime: new Date().toISOString(),
      };

      this.loginservice.Inquiry(objData).subscribe({
        next: (data: any) => {
          this.loadingDR = false;
          this.toastr.success('Inquiry submitted successfully');
          this.closeInquiryPopup();
        },
        error: () => {
          this.loadingDR = false;
          this.toastr.error('Inquiry submission failed');
        },
      });
    }
  }

  // 🔹 Basic validation
  ValidationInquiry() {
    // Org Name
    if (!this.orgInput.nativeElement.value.trim()) {
      this.toastr.error('Organization Name is required');
      this.orgInput.nativeElement.focus();
      return false;
    }

    // Address
    if (!this.addrInput.nativeElement.value.trim()) {
      this.toastr.error('Address is required');
      this.addrInput.nativeElement.focus();
      return false;
    }

    // Contact
    if (!this.contactInput.nativeElement.value.trim()) {
      this.toastr.error('Contact is required');
      this.contactInput.nativeElement.focus();
      return false;
    }

    // Email
    if (!this.emailInput.nativeElement.value.trim()) {
      this.toastr.error('Email is required');
      this.emailInput.nativeElement.focus();
      return false;
    }

    // Nature (Select2)

    if ($('#Nature').val() === '') {
      this.toastr.error('Nature is required');
      $('#Nature').focus();
      return false;
    }

    // Remarks
    if (!this.remarksInput.nativeElement.value.trim()) {
      this.toastr.error('Remarks is required');
      this.remarksInput.nativeElement.focus();
      return false;
    }

    return true;
  }

  about() {
    this.isAboutShown = true;
  }

  closeAbout() {
    this.isAboutShown = false;
  }

  faq() {
    this.isFAQShown = true;
  }
  closeFAQ() {
    this.isFAQShown = false;
  }

  // Accordion
  openItem: number = 0;

  toggle(id: number) {
    this.openItem = this.openItem === id ? 0 : id;
  }
}
