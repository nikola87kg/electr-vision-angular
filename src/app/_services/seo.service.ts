import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser'

@Injectable({ providedIn: 'root' })
export class SeoService {
    constructor( private meta: Meta, private title: Title ) {}

    generateTags(config) {
        config = {
            title: 'SEO Electrovision Title',
            description: 'SEO Descripion',
            slug: 'seo-slug',
            image:'https://lh3.googleusercontent.com/proxy/ogwfaF0iwa05OnTNQFyD0rZ384sAN74p5xwJE6qfJmrEFcmgxlXo4zg22lrlaLcaS_hp9pFCu8s8QZ-GgDy37DxWVOHpq2B4IV35vb4wgHBWfJiYqI_AVARVMaguPane4Raedg=w530-h212-p',
            ...config
        }

        this.title.setTitle( config.title + ' | ElectroVision Kragujevac'  )

        this.meta.updateTag( { name: 'twitter:card', content: 'summary' } );
        this.meta.updateTag( { name: 'twitter:site', content: 'ElectroVision' } );
        this.meta.updateTag( { name: 'twitter:title', content: config.title } );
        this.meta.updateTag( { name: 'twitter:description', content: config.description } );
        this.meta.updateTag( { name: 'twitter:image', content: config.image } );

        this.meta.updateTag( { property: 'og:type', content: 'summary' } );
        this.meta.updateTag( { property: 'og:site_name', content: 'ElectroVision' } );
        this.meta.updateTag( { property: 'og:title', content: config.title } );
        this.meta.updateTag( { property: 'og:description', content: config.description } );
        this.meta.updateTag( { property: 'og:image', content: config.image } );
        this.meta.updateTag( { property: 'og:url', content: 'http://electrovision.rs/' + config.slug } );
    }
}
