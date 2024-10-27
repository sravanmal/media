using { cuid } from '@sap/cds/common';

namespace media.db;

entity media : cuid {
    @Core.ContentDisposition.Filename: filename
     @Core.ContentDisposition.Type: 'inline'
    @Core.MediaType: MediaType
    content: LargeBinary;
    filename : String;
    @Core.IsMediaType: true
    MediaType : String;
    url: String;
}

