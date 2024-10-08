import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';


/**
 * Test suite for FooterComponent
 */
describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;


  /**
   * Setup before each test.
   * Configures the testing module and creates an instance of the FooterComponent.
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  /**
   * Test case to verify that the FooterComponent is created successfully.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
