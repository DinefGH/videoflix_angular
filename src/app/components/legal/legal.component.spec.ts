import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LegalComponent } from './legal.component';


/**
 * Test suite for the LegalComponent.
 */
describe('LegalComponent', () => {
  let component: LegalComponent;
  let fixture: ComponentFixture<LegalComponent>;


  /**
   * Sets up the testing environment for the LegalComponent before each test case.
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  /**
   * Test case to ensure that the component is created successfully.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
