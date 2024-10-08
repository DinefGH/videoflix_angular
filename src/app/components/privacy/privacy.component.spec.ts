import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrivacyComponent } from './privacy.component';


/**
 * Test suite for the PrivacyComponent.
 */
describe('PrivacyComponent', () => {
  let component: PrivacyComponent;
  let fixture: ComponentFixture<PrivacyComponent>;


  /**
   * Before each test, set up the TestBed for the PrivacyComponent.
   * Compile the component and initialize its instance.
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  /**
   * Test to ensure that the PrivacyComponent is created successfully.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
