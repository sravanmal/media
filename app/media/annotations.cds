using MediaService as service from '../../srv/mediaservice';
annotate service.media with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'content',
                Value : content,
            },
            {
                $Type : 'UI.DataField',
                Label : 'filename',
                Value : filename,
            },
            {
                $Type : 'UI.DataField',
                Label : 'MediaType',
                Value : MediaType,
            },
            {
                $Type : 'UI.DataField',
                Label : 'url',
                Value : url,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'content',
            Value : content,
        },
        {
            $Type : 'UI.DataField',
            Label : 'filename',
            Value : filename,
        },
        {
            $Type : 'UI.DataField',
            Label : 'MediaType',
            Value : MediaType,
        },
        {
            $Type : 'UI.DataField',
            Label : 'url',
            Value : url,
        },
    ],
    UI.SelectionFields : [
        filename,
        MediaType
    ]
);

