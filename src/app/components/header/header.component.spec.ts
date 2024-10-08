import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';


/**
 * Test suite for the HeaderComponent.
 */
describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;



  /**
   * Sets up the testing environment for each test case.
   * Initializes the HeaderComponent and mocks the ActivatedRoute.
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  /**
   * Verifies that the HeaderComponent is created successfully.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
