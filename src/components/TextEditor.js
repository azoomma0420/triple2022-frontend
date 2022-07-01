import React, { Component } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { getCookie } from './Cookies'
import Review from './Review'

class TextEditor extends Component{
  render(){
  //https://medium.com/swlh/ckeditor5-with-custom-image-uploader-on-react-67b4496cb07d
  //https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/upload-adapter.html#activating-a-custom-upload-adapter
    const custom_config = {
      extraPlugins: [ MyCustomUploadAdapterPlugin ],
      toolbar: {
        items: [
          'heading',
          '|',
          'bold',
          'italic',
          'link',
          'bulletedList',
          'numberedList',
          '|',
          'blockQuote',
          'insertTable',
          '|',
          'imageUpload',
          'undo',
          'redo'
        ]
      },
      table: {
        contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
      }
    }

    return(
        <div>
          <h2>{this.props.userName}님 현재 포인트 {this.props.point}점 입니다.</h2>
          <CKEditor
            required
            editor={ClassicEditor}
            config={custom_config}
            onChange={(event, editor) => {
                this.props.setContent(editor.getData())
            }}
          />
          <p>남긴 리뷰 들...</p>
          {
            this.props.reviews?.map(review=> (<Review review={review} />))
          }
        </div>
    )
  }
}

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get( 'FileRepository' ).createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader)
  }
}

class MyUploadAdapter {
    constructor(props) {
        // CKEditor 5's FileLoader instance.
      this.loader = props;
      // URL where to send files.
      this.url = `http://localhost:8080/saveImage`;
    }

    // Starts the upload process.
    upload() {
        return new Promise((resolve, reject) => {
            this._initRequest();
            this._initListeners(resolve, reject);
            this._sendRequest();
        } );
    }

    // Aborts the upload process.
    abort() {
        if ( this.xhr ) {
            this.xhr.abort();
        }
    }

    // Example implementation using XMLHttpRequest.
    _initRequest() {
        let cookie = getCookie('TRIPLE_SID')
        let token = 'Bearer ' + cookie?.data
        const xhr = this.xhr = new XMLHttpRequest();

        xhr.open('POST', this.url, true);
        //xhr.responseType = 'json';
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
        xhr.setRequestHeader('Authorization', token)
    }

    // Initializes XMLHttpRequest listeners.
    _initListeners( resolve, reject ) {
        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = 'cannot upload file:' + ` ${ loader.file.name }.`;

        xhr.addEventListener( 'error', () => reject( genericErrorText ) );
        xhr.addEventListener( 'abort', () => reject() );
        xhr.addEventListener( 'load', () => {
            const response = xhr.response;
            if ( !response || response.error ) {
                return reject( response && response.error ? response.error.message : genericErrorText );
            }

            // If the upload is successful, resolve the upload promise with an object containing
            // at least the "default" URL, pointing to the image on the server.
            resolve({
                default: response.s3Url
            });
        } );

        if ( xhr.upload ) {
            xhr.upload.addEventListener( 'progress', evt => {
                if ( evt.lengthComputable ) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            } );
        }
    }

    // Prepares the data and sends the request.
    _sendRequest() {
        const data = new FormData();
        data.append('type', "REVIEW");
        this.loader.file.then(result => {
          data.append('file', result);
          this.xhr.send(data);
          }
        )
    }

}

export default TextEditor