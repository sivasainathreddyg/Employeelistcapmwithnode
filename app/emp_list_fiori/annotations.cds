using CatalogService as service from '../../srv/interactions_srv';

annotate service.Interactions_Header with @(
    UI.FieldGroup #GeneratedGroup1: {
        $Type: 'UI.FieldGroupType',
        Data: [{
                $Type: 'UI.DataField',
                Label: '{i18n>EmployeeId}',
                Value: empID,
            },
            {
                $Type: 'UI.DataField',
                Label: '{i18n>EmpName}',
                Value: empName,
            },
            {
                $Type: 'UI.DataField',
                Label: '{i18n>Phone}',
                Value: phone,
            },
        ],
    },
    UI.Facets: [{
        $Type: 'UI.ReferenceFacet',
        ID: 'GeneratedFacet1',
        Label: '{i18n>EmployeeInformation}',
        Target: '@UI.FieldGroup#GeneratedGroup1',
    },
    {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>PersonalInfo}',
            ID : 'i18nPersonalInfo',
            Target : '@UI.Identification',
    },
     ]
);

annotate service.Interactions_Header with
@(
    UI.LineItem: [
        {
            $Type: 'UI.DataField',
            Value: empID,
            Label: '{i18n>EmployeeId}'
        },
        {
            $Type: 'UI.DataField',
            Label: '{i18n>EmpName}',
            Value: empName,
        },
        {
            $Type: 'UI.DataField',
            Label: '{i18n>Phone}',
            Value: phone,
        },
        {
            $Type: 'UI.DataField',
            Label: '{i18n>Priority}',
            Value: priority_code,
            Criticality: criticality,
            CriticalityRepresentation: #WithoutIcon,
        },
    ],
);
annotate service.Interactions_Header with @(
    UI.SelectionFields : [
        priority_code,
    ]
);


annotate service.Interactions_Header with {
    priority_code @Common.Label : '{i18n>Priority}'
};
annotate service.Interactions_Header with {
    empName @Common.FieldControl : #Mandatory
};

annotate service.Interactions_Header with {
    empID @Common.FieldControl : #Mandatory
};

annotate service.Interactions_Header with @(
    UI.HeaderInfo : {
        TypeName : '{i18n>EmployeeDetails}',
        TypeNamePlural : '',
    }
);
annotate service.Interactions_Header with @(
    UI.Identification : [
        {
            $Type : 'UI.DataField',
            Value : priority_code,
            Label : '{i18n>Priority}',
        },
        {
            $Type : 'UI.DataFieldForAnnotation',
            Target : '@Communication.Contact#contact1',
            Label : '{i18n>ContactNumber}',
        },]
);
annotate service.Interactions_Header with @(
    Communication.Contact #contact : {
        $Type : 'Communication.ContactType',
        fn : phone,
    }
);
annotate service.Interactions_Header with @(
    Communication.Contact #contact1 : {
        $Type : 'Communication.ContactType',
        fn : phone,
        tel : [
            {
                $Type : 'Communication.PhoneNumberType',
                uri : phone,
            },
        ],
    }
);
