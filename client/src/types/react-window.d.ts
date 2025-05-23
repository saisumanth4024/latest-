declare module 'react-window' {
  import * as React from 'react';

  // FixedSizeList types
  export interface FixedSizeListProps {
    children: React.ComponentType<{
      index: number;
      style: React.CSSProperties;
      data?: any;
    }>;
    className?: string;
    height: number;
    itemCount: number;
    itemData?: any;
    itemKey?: (index: number, data: any) => string | number;
    itemSize: number;
    layout?: 'horizontal' | 'vertical';
    width: number;
    overscanCount?: number;
    useIsScrolling?: boolean;
    onItemsRendered?: (props: {
      overscanStartIndex: number;
      overscanStopIndex: number;
      visibleStartIndex: number;
      visibleStopIndex: number;
    }) => void;
    onScroll?: (props: {
      scrollDirection: 'forward' | 'backward';
      scrollOffset: number;
      scrollUpdateWasRequested: boolean;
    }) => void;
    initialScrollOffset?: number;
    style?: React.CSSProperties;
    direction?: 'ltr' | 'rtl';
  }

  export class FixedSizeList extends React.Component<FixedSizeListProps> {
    scrollTo(offset: number): void;
    scrollToItem(index: number, align?: 'auto' | 'start' | 'center' | 'end'): void;
  }

  // FixedSizeGrid types
  export interface FixedSizeGridProps {
    children: React.ComponentType<{
      columnIndex: number;
      rowIndex: number;
      style: React.CSSProperties;
      data?: any;
    }>;
    className?: string;
    columnCount: number;
    columnWidth: number;
    height: number;
    itemData?: any;
    rowCount: number;
    rowHeight: number;
    width: number;
    onItemsRendered?: (props: {
      overscanColumnStartIndex: number;
      overscanColumnStopIndex: number;
      overscanRowStartIndex: number;
      overscanRowStopIndex: number;
      visibleColumnStartIndex: number;
      visibleColumnStopIndex: number;
      visibleRowStartIndex: number;
      visibleRowStopIndex: number;
    }) => void;
    onScroll?: (props: {
      horizontalScrollDirection: 'forward' | 'backward';
      scrollLeft: number;
      scrollTop: number;
      scrollUpdateWasRequested: boolean;
      verticalScrollDirection: 'forward' | 'backward';
    }) => void;
    overscanColumnCount?: number;
    overscanRowCount?: number;
    initialScrollLeft?: number;
    initialScrollTop?: number;
    style?: React.CSSProperties;
    direction?: 'ltr' | 'rtl';
  }

  export class FixedSizeGrid extends React.Component<FixedSizeGridProps> {
    scrollTo(props: { scrollLeft: number; scrollTop: number }): void;
    scrollToItem(props: {
      align?: 'auto' | 'start' | 'center' | 'end';
      columnIndex?: number;
      rowIndex?: number;
    }): void;
  }

  // areEqual utility
  export function areEqual(
    prevProps: { style: React.CSSProperties; [key: string]: any },
    nextProps: { style: React.CSSProperties; [key: string]: any },
  ): boolean;
}

declare module 'react-virtualized-auto-sizer' {
  import * as React from 'react';

  interface AutoSizerProps {
    children: (size: { height: number; width: number }) => React.ReactNode;
    className?: string;
    defaultHeight?: number;
    defaultWidth?: number;
    disableHeight?: boolean;
    disableWidth?: boolean;
    onResize?: (size: { height: number; width: number }) => void;
    style?: React.CSSProperties;
  }

  export default class AutoSizer extends React.Component<AutoSizerProps> {}
}