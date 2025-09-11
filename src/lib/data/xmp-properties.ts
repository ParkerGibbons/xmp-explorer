import type { XmpProperty } from '$lib/types/xmp';

export const seedData: XmpProperty[] = [
  {
    qname: 'dc:title',
    prefix: 'dc',
    namespaceURI: 'http://purl.org/dc/elements/1.1/',
    category: 'Core',
    valueType: 'Text',
    valueForm: 'simple',
    description: 'The name given to the resource',
    mediaTags: ['any'],
    notes: 'Dublin Core title element'
  },
  {
    qname: 'dc:creator',
    prefix: 'dc',
    namespaceURI: 'http://purl.org/dc/elements/1.1/',
    category: 'Core',
    valueType: 'Text',
    valueForm: 'array-bag',
    description: 'An entity primarily responsible for making the resource',
    mediaTags: ['any'],
    notes: 'Dublin Core creator element'
  },
  {
    qname: 'xmp:CreateDate',
    prefix: 'xmp',
    namespaceURI: 'http://ns.adobe.com/xap/1.0/',
    category: 'Core',
    valueType: 'Date',
    valueForm: 'simple',
    description: 'The date and time the resource was created',
    mediaTags: ['any'],
    notes: 'XMP Core schema creation date'
  },
  {
    qname: 'xmp:ModifyDate',
    prefix: 'xmp',
    namespaceURI: 'http://ns.adobe.com/xap/1.0/',
    category: 'Core',
    valueType: 'Date',
    valueForm: 'simple',
    description: 'The date and time the resource was last modified',
    mediaTags: ['any'],
    notes: 'XMP Core schema modification date'
  },
  {
    qname: 'exif:ExposureTime',
    prefix: 'exif',
    namespaceURI: 'http://ns.adobe.com/exif/1.0/',
    category: 'Specialized',
    valueType: 'Rational',
    valueForm: 'simple',
    description: 'Exposure time, given in seconds',
    mediaTags: ['image'],
    notes: 'EXIF exposure time'
  },
  {
    qname: 'exif:FNumber',
    prefix: 'exif',
    namespaceURI: 'http://ns.adobe.com/exif/1.0/',
    category: 'Specialized',
    valueType: 'Rational',
    valueForm: 'simple',
    description: 'The F number',
    mediaTags: ['image'],
    notes: 'EXIF F-number'
  },
  {
    qname: 'xmpMM:DocumentID',
    prefix: 'xmpMM',
    namespaceURI: 'http://ns.adobe.com/xap/1.0/mm/',
    category: 'Standard',
    valueType: 'Text',
    valueForm: 'simple',
    description: 'The common identifier for all versions and renditions of a document',
    mediaTags: ['any'],
    notes: 'XMP Media Management document ID'
  },
  {
    qname: 'xmpMM:InstanceID',
    prefix: 'xmpMM',
    namespaceURI: 'http://ns.adobe.com/xap/1.0/mm/',
    category: 'Standard',
    valueType: 'Text',
    valueForm: 'simple',
    description: 'An identifier for a specific incarnation of a document',
    mediaTags: ['any'],
    notes: 'XMP Media Management instance ID'
  }
];
