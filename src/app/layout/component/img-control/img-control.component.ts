import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-img-control',
  templateUrl: './img-control.component.html',
  styleUrls: ['./img-control.component.scss'],
})
export class ImgControlComponent {
  defultImg = '../../../../assets/images/upload.jpeg';
  fileSrc = '';
  filebase64: any;
  dataFrom: FormGroup;
  visible: boolean = false;
  fileSize: string = '';

  @Output() onSelected = new EventEmitter<any>();
  @Input() fileInput: string = '';

  constructor(public formBuilder: FormBuilder) {
    this.dataFrom = this.formBuilder.group({
      fileName: [''],
    });
  }

  onFileChange(event: any) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      // console.log(file.size/1024);
      this.fileSize = (file.size / 1024).toFixed(2);

      reader.onload = () => {
        this.fileSrc = reader.result as string;
        this.filebase64 = reader.result;
        this.onSelect();
        //const imageFile = this.form['productImage'].value;

        // this.form['productImage'].setValue(reader.result);
      };
    }
  }

  FileClear() {
    this.fileSrc = '';
    this.filebase64 = '';
    this.dataFrom.reset();
    this.onSelect();
  }

  ClearImage() {
    console.log('clear image');

    this.fileSrc = '';
    this.filebase64 = '';
    this.dataFrom.reset();
  }

  onSelect() {
    // console.log(file);
    this.onSelected.emit(this.filebase64);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('Change');

    if (this.fileInput != '' && this.fileInput != undefined)
      this.fileSrc = this.fileInput;
  }
}
