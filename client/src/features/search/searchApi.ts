import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ProductsResponse, ProductFilters } from '@/features/products/productsApi';
import { HotTag, AutoSuggestion } from './searchSlice';

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  level: number;
  imageUrl?: string;
  productCount: number;
  children?: CategoryData[];
  attributes?: CategoryAttribute[];
}

export interface CategoryAttribute {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect' | 'color';
  required: boolean;
  options?: string[];
  unit?: string;
}

export interface TagData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count: number;
  trending?: boolean;
  groups?: string[];
}

export interface BrandData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  productCount: number;
}

export interface SearchSuggestionRequest {
  query: string;
  limit?: number;
}

export interface TrendingTagsResponse {
  tags: HotTag[];
}

export interface SearchSuggestionResponse {
  suggestions: AutoSuggestion[];
}

export interface CategoriesResponse {
  categories: CategoryData[];
}

export interface BrandsResponse {
  brands: BrandData[];
}

export interface TagsResponse {
  tags: TagData[];
}

// Sample category data for development
const sampleCategories: CategoryData[] = [
  {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and accessories',
    level: 0,
    productCount: 560,
    children: [
      {
        id: '1-1',
        name: 'Audio',
        slug: 'audio',
        parentId: '1',
        level: 1,
        productCount: 120,
        children: [
          {
            id: '1-1-1',
            name: 'Headphones',
            slug: 'headphones',
            parentId: '1-1',
            level: 2,
            productCount: 55,
            attributes: [
              {
                id: '1',
                name: 'Type',
                type: 'select',
                required: true,
                options: ['Over-ear', 'On-ear', 'In-ear', 'True Wireless']
              },
              {
                id: '2',
                name: 'Wireless',
                type: 'boolean',
                required: true
              },
              {
                id: '3',
                name: 'Noise Cancelling',
                type: 'boolean',
                required: false
              }
            ]
          },
          {
            id: '1-1-2',
            name: 'Speakers',
            slug: 'speakers',
            parentId: '1-1',
            level: 2,
            productCount: 35,
            attributes: [
              {
                id: '1',
                name: 'Type',
                type: 'select',
                required: true,
                options: ['Bluetooth', 'Smart', 'Wired', 'Portable']
              },
              {
                id: '2',
                name: 'Power',
                type: 'number',
                required: false,
                unit: 'W'
              }
            ]
          },
          {
            id: '1-1-3',
            name: 'Microphones',
            slug: 'microphones',
            parentId: '1-1',
            level: 2,
            productCount: 30
          }
        ]
      },
      {
        id: '1-2',
        name: 'Computers',
        slug: 'computers',
        parentId: '1',
        level: 1,
        productCount: 220,
        children: [
          {
            id: '1-2-1',
            name: 'Laptops',
            slug: 'laptops',
            parentId: '1-2',
            level: 2,
            productCount: 120
          },
          {
            id: '1-2-2',
            name: 'Desktops',
            slug: 'desktops',
            parentId: '1-2',
            level: 2,
            productCount: 50
          },
          {
            id: '1-2-3',
            name: 'Accessories',
            slug: 'computer-accessories',
            parentId: '1-2',
            level: 2,
            productCount: 50
          }
        ]
      },
      {
        id: '1-3',
        name: 'Mobile Devices',
        slug: 'mobile-devices',
        parentId: '1',
        level: 1,
        productCount: 180,
        children: [
          {
            id: '1-3-1',
            name: 'Smartphones',
            slug: 'smartphones',
            parentId: '1-3',
            level: 2,
            productCount: 85
          },
          {
            id: '1-3-2',
            name: 'Tablets',
            slug: 'tablets',
            parentId: '1-3',
            level: 2,
            productCount: 45
          },
          {
            id: '1-3-3',
            name: 'Wearables',
            slug: 'wearables',
            parentId: '1-3',
            level: 2,
            productCount: 50
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    description: 'Home appliances, furniture, and kitchenware',
    level: 0,
    productCount: 420,
    children: [
      {
        id: '2-1',
        name: 'Appliances',
        slug: 'appliances',
        parentId: '2',
        level: 1,
        productCount: 150
      },
      {
        id: '2-2',
        name: 'Furniture',
        slug: 'furniture',
        parentId: '2',
        level: 1,
        productCount: 180
      },
      {
        id: '2-3',
        name: 'Kitchenware',
        slug: 'kitchenware',
        parentId: '2',
        level: 1,
        productCount: 90
      }
    ]
  },
  {
    id: '3',
    name: 'Clothing & Accessories',
    slug: 'clothing-accessories',
    description: 'Apparel, shoes, and accessories',
    level: 0,
    productCount: 780,
    children: []
  }
];

// Sample brand data for development
const sampleBrands: BrandData[] = [
  {
    id: '1',
    name: 'SoundMaster',
    slug: 'soundmaster',
    description: 'Premium audio equipment manufacturer',
    logoUrl: 'https://placehold.co/200x200?text=SoundMaster',
    websiteUrl: 'https://example.com/soundmaster',
    productCount: 78
  },
  {
    id: '2',
    name: 'TechVision',
    slug: 'techvision',
    description: 'High-quality display and TV manufacturer',
    logoUrl: 'https://placehold.co/200x200?text=TechVision',
    websiteUrl: 'https://example.com/techvision',
    productCount: 45
  },
  {
    id: '3',
    name: 'PhotoPro',
    slug: 'photopro',
    description: 'Professional photography equipment',
    logoUrl: 'https://placehold.co/200x200?text=PhotoPro',
    websiteUrl: 'https://example.com/photopro',
    productCount: 36
  },
  {
    id: '4',
    name: 'TechBook',
    slug: 'techbook',
    description: 'Innovative laptop and computer manufacturer',
    logoUrl: 'https://placehold.co/200x200?text=TechBook',
    websiteUrl: 'https://example.com/techbook',
    productCount: 29
  },
  {
    id: '5',
    name: 'PowerTech',
    slug: 'powertech',
    description: 'Charging and power solutions',
    logoUrl: 'https://placehold.co/200x200?text=PowerTech',
    websiteUrl: 'https://example.com/powertech',
    productCount: 54
  },
  {
    id: '6',
    name: 'GameTech',
    slug: 'gametech',
    description: 'Gaming peripherals and accessories',
    logoUrl: 'https://placehold.co/200x200?text=GameTech',
    websiteUrl: 'https://example.com/gametech',
    productCount: 42
  },
  {
    id: '7',
    name: 'HomeConnect',
    slug: 'homeconnect',
    description: 'Smart home devices and solutions',
    logoUrl: 'https://placehold.co/200x200?text=HomeConnect',
    websiteUrl: 'https://example.com/homeconnect',
    productCount: 38
  },
  {
    id: '8',
    name: 'FitTech',
    slug: 'fittech',
    description: 'Fitness and health tracking devices',
    logoUrl: 'https://placehold.co/200x200?text=FitTech',
    websiteUrl: 'https://example.com/fittech',
    productCount: 25
  }
];

// Sample tag data for development
const sampleTags: TagData[] = [
  {
    id: '1',
    name: 'wireless',
    slug: 'wireless',
    count: 125,
    trending: true,
    groups: ['features', 'popular']
  },
  {
    id: '2',
    name: 'bluetooth',
    slug: 'bluetooth',
    count: 98,
    trending: false,
    groups: ['features', 'connectivity']
  },
  {
    id: '3',
    name: 'noise-cancelling',
    slug: 'noise-cancelling',
    count: 45,
    trending: true,
    groups: ['features', 'audio']
  },
  {
    id: '4',
    name: 'gaming',
    slug: 'gaming',
    count: 76,
    trending: true,
    groups: ['use-case', 'popular']
  },
  {
    id: '5',
    name: '4k',
    slug: '4k',
    count: 65,
    trending: false,
    groups: ['features', 'video']
  },
  {
    id: '6',
    name: 'smart-home',
    slug: 'smart-home',
    count: 54,
    trending: true,
    groups: ['category', 'popular']
  },
  {
    id: '7',
    name: 'waterproof',
    slug: 'waterproof',
    count: 42,
    trending: false,
    groups: ['features']
  },
  {
    id: '8',
    name: 'portable',
    slug: 'portable',
    count: 87,
    trending: true,
    groups: ['features', 'popular']
  },
  {
    id: '9',
    name: 'fast-charging',
    slug: 'fast-charging',
    count: 66,
    trending: true,
    groups: ['features', 'power']
  },
  {
    id: '10',
    name: 'professional',
    slug: 'professional',
    count: 35,
    trending: false,
    groups: ['use-case']
  }
];

// Sample hot tags data for development
const sampleHotTags: HotTag[] = [
  { id: '1', name: 'wireless', count: 125, trending: true },
  { id: '2', name: 'headphones', count: 98, trending: true },
  { id: '3', name: 'bluetooth', count: 87, trending: false },
  { id: '4', name: 'gaming', count: 76, trending: true },
  { id: '5', name: '4k', count: 65, trending: false },
  { id: '6', name: 'smart-home', count: 54, trending: true },
];

// Sample search suggestions for development
const getSampleSuggestions = (query: string): AutoSuggestion[] => {
  const lowerQuery = query.toLowerCase();
  if (!lowerQuery || lowerQuery.length < 2) return [];
  
  return [
    { 
      id: '1', 
      type: 'product', 
      text: `${query} wireless headphones`,
      thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=50&h=50&fit=crop'
    },
    { 
      id: '2', 
      type: 'category', 
      text: 'Electronics'
    },
    { 
      id: '3', 
      type: 'brand', 
      text: 'SoundMaster'
    },
    { 
      id: '4', 
      type: 'tag', 
      text: 'wireless'
    },
    { 
      id: '5', 
      type: 'product', 
      text: `${query} premium speakers`,
      thumbnail: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=50&h=50&fit=crop'
    }
  ];
};

export const searchApi = createApi({
  reducerPath: 'searchApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    getSearchSuggestions: builder.query<SearchSuggestionResponse, SearchSuggestionRequest>({
      queryFn: ({ query, limit = 5 }) => {
        try {
          const suggestions = getSampleSuggestions(query).slice(0, limit);
          return { data: { suggestions } };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
    }),
    getHotTags: builder.query<TrendingTagsResponse, void>({
      queryFn: () => {
        try {
          return { data: { tags: sampleHotTags } };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
    }),
    getCategories: builder.query<CategoriesResponse, void>({
      queryFn: () => {
        try {
          return { data: { categories: sampleCategories } };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
    }),
    getCategoryById: builder.query<CategoryData, string>({
      queryFn: (id) => {
        try {
          // Recursive function to find a category by ID at any level
          const findCategory = (categories: CategoryData[], targetId: string): CategoryData | null => {
            for (const category of categories) {
              if (category.id === targetId) {
                return category;
              }
              if (category.children && category.children.length > 0) {
                const found = findCategory(category.children, targetId);
                if (found) return found;
              }
            }
            return null;
          };
          
          const category = findCategory(sampleCategories, id);
          if (!category) {
            return { error: { status: 404, data: 'Category not found' } };
          }
          return { data: category };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
    }),
    getBrands: builder.query<BrandsResponse, void>({
      queryFn: () => {
        try {
          return { data: { brands: sampleBrands } };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
    }),
    getBrandById: builder.query<BrandData, string>({
      queryFn: (id) => {
        try {
          const brand = sampleBrands.find(b => b.id === id);
          if (!brand) {
            return { error: { status: 404, data: 'Brand not found' } };
          }
          return { data: brand };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
    }),
    getTags: builder.query<TagsResponse, void>({
      queryFn: () => {
        try {
          return { data: { tags: sampleTags } };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
    }),
    getTagById: builder.query<TagData, string>({
      queryFn: (id) => {
        try {
          const tag = sampleTags.find(t => t.id === id);
          if (!tag) {
            return { error: { status: 404, data: 'Tag not found' } };
          }
          return { data: tag };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
    }),
  }),
});

export const {
  useGetSearchSuggestionsQuery,
  useGetHotTagsQuery,
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetBrandsQuery,
  useGetBrandByIdQuery,
  useGetTagsQuery,
  useGetTagByIdQuery,
} = searchApi;