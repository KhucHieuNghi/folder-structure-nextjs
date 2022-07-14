//  <reference path="../../node_modules/@types/react/index.d.ts"/>
import '@emotion/react';
import { AriaAttributes, DOMAttributes } from 'react';

import { AxiosError } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { WithUserAgentProps } from 'next-useragent';

declare module '@emotion/react' {
  export interface Theme {
    colors: {
        [key: string]: string
    }
    mbColors: {
        [key: string]: string
    }
    sizes: {
        [key: string]: string
    }
    zIndexes: {
        [key: string]: string
    }
  }
}

declare module '*.svg' {
    import { FunctionComponent } from 'react';

    const content: FunctionComponent<{
        className?: string;
    }>;

    // noinspection JSDuplicatedDeclaration
    export default content;
}

declare module 'react' {

    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
        css?: any
    }
}

declare module 'next' {

    interface NextApiRequestCustom extends NextApiRequest {
        RESP: () => unknown
    }

    interface NextApiResponseCustom extends NextApiResponse {
        RESP: (param: unknown) => unknown
    }
}

declare global {

    type ValueOf<T> = T[keyof T];
    
    type PageProps<T> = WithUserAgentProps & T & {
        query?: {
            [key: string] : number | string
        }
    }
    
    type Dict<T = Record<string, unknown>> = {
        [key: string]: T | string | number | boolean | undefined | object | unknown | never;
    }

    type CMSAttribute = {
        id: number,
        attributes: any
    }

    type Enumerable<T> = {
        [P in keyof T]: T[P];
    };
    
    export type CMSFields<T> =  keyof Pick<
    T,
    {
      [K in keyof Required<T>]: Required<T>[K] extends string | number | boolean | Array<string> | Array<number> ? K : never;
    }[keyof T]>
    
    export type CMSPopulateFields<T> = keyof Omit<T, CMSFields<T>>
    
    export type CMSFieldsArray<T> = Array<CMSFields<T>>;
    
    type ChildPopulate<T> =  {
      [K in Extract<CMSPopulateFields<T>, keyof T>]: `${ Extract<K, string> }.${ Extract<CMSPopulateFields<T[K]>, string> }`
    }[CMSPopulateFields<T>]
    
    export type CMSPopulateArray<T, K = undefined> = Array<(CMSPopulateFields<T>) | ChildPopulate<T> | K>;
    
    export type ErrorPage = AxiosError & {
        statusCode: number
        isAxiosError: boolean
      }
}