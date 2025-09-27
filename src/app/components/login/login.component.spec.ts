import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'; // Import FormsModule for two-way binding
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ FormsModule ] // Add FormsModule to imports
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log username and password on login', () => {
    component.username = 'testuser';
    component.password = 'testpass';
    spyOn(console, 'log');
    component.onLogin();
    expect(console.log).toHaveBeenCalledWith('Login attempted with', 'testuser', 'testpass');
  });
});
