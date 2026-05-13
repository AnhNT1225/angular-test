import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appDragDrop]',
})
export class DragDropDirective {
  @Input() draggableItem: any; // The item being dragged (from table or dropdown)
  @Input() list: Array<any> = []; // The table list to which the items are added
  @Output() listChange = new EventEmitter<Array<any>>(); // Emit changes when list is updated
  @Input() isFromDropdown: boolean = true;

  private dragStartIndex!: number; // For tracking the index of the dragged item in the list

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {
    // Make the element draggable
    this.renderer.setAttribute(this.el.nativeElement, 'draggable', 'true');
  }

  //When dragging starts
  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent) {
    this.dragStartIndex = this.list.indexOf(this.draggableItem);

    if (this.dragStartIndex !== -1) {
      // Item is from the table
      event.dataTransfer?.setData('text/plain', this.dragStartIndex.toString());

      console.log('Dragging item from table:', this.draggableItem);
    } else {
      // Item is from dropdown
      event.dataTransfer?.setData('text/plain', 'new-item');
      event.dataTransfer?.setData('item', JSON.stringify(this.draggableItem));

      console.log('Dragging new item from dropdown:', this.draggableItem);
    }

    // Add dragging style
    this.renderer.addClass(this.el.nativeElement, 'dragging-background');
    setTimeout(() => {
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '0.5');
    }, 0);
  }

  // When dragging ends
  @HostListener('dragend')
  onDragEnd() {
    // Remove dragging styles
    this.renderer.removeClass(this.el.nativeElement, 'dragging-background');
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');

    console.log('Drag operation ended for item:', this.draggableItem);
  }

  // Allow drop by preventing default dragover behavior
  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();

    const data = event.dataTransfer?.getData('text/plain');

    if (data === 'new-item') {
      // Retrieve the new beneficiary from the dragged item data
      const newBeneficiary = JSON.parse(event.dataTransfer?.getData('item')!);
      const newBeneficiaryAccountId = newBeneficiary.beneficiary;

      if (newBeneficiaryAccountId) {
        console.log('New beneficiary being processed:', newBeneficiary);

        const referenceDate =
          this.list.length > 0
            ? this.list[0].dateCreated
            : new Date().toISOString();

        newBeneficiary.beneficiaryAccountId = newBeneficiaryAccountId;
        newBeneficiary.dateCreated = referenceDate;

        this.list.push(newBeneficiary);
        this.listChange.emit(this.list);
        console.log('New beneficiary added with dateCreated:', newBeneficiary);
      } else {
        console.error('Beneficiary Account ID is undefined or invalid.');
      }
    } else {
      // Handle reordering logic when dragging within the table
      const dragEndIndex = this.list.indexOf(this.draggableItem);
      const startIndex = +data!; // Convert start index from string to number

      if (startIndex !== dragEndIndex) {
        [this.list[startIndex], this.list[dragEndIndex]] = [
          this.list[startIndex - 1],
          this.list[startIndex + 1],
        ];

        this.listChange.emit(this.list);
        console.log('Swapped beneficiaries in table:', this.list);
      }
    }
  }
}
