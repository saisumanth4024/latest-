import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  sampleProducts, 
  sampleUsers, 
  sampleNotifications,
  isPhysicalProduct,
  isDigitalProduct,
  isSubscriptionProduct,
  isToastNotification,
  isModalNotification,
  isInAppNotification
} from './types/index';

// Import enhanced components that use advanced TypeScript patterns
import GenericList from '../products/components/GenericList';
import GenericDropdown from '../products/components/GenericDropdown';
import GenericSearchBar from '../products/components/GenericSearchBar';
import EnhancedProductsComponent from '../products/components/EnhancedProductsComponent';

/**
 * Demo component for showcasing TypeScript advanced patterns
 */
const TypeScriptPatternsDemo: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchParams, setSearchParams] = useState({});

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">TypeScript Advanced Patterns</h1>
        <p className="text-gray-600 dark:text-gray-400">
          This demo showcases advanced TypeScript patterns used in enterprise React applications.
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="generics">Generic Components</TabsTrigger>
          <TabsTrigger value="discriminated">Discriminated Unions</TabsTrigger>
          <TabsTrigger value="utility">Utility Types</TabsTrigger>
          <TabsTrigger value="products">Enhanced Products</TabsTrigger>
        </TabsList>

        {/* Overview tab */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Advanced TypeScript Patterns Overview</CardTitle>
              <CardDescription>
                The following TypeScript patterns are demonstrated in this application:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Generic Components</h3>
                <p>Reusable components that can work with various data types while maintaining type safety.</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="outline">GenericList&lt;T&gt;</Badge>
                  <Badge variant="outline">GenericDropdown&lt;T&gt;</Badge>
                  <Badge variant="outline">GenericSearchBar&lt;T&gt;</Badge>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Discriminated Unions</h3>
                <p>Union types with a common property that allows TypeScript to narrow down the type.</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="outline">NotificationType</Badge>
                  <Badge variant="outline">ProductAvailabilityState</Badge>
                  <Badge variant="outline">ProductPricingState</Badge>
                  <Badge variant="outline">ApiResponse&lt;T&gt;</Badge>
                  <Badge variant="outline">UiState&lt;T&gt;</Badge>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Utility Types</h3>
                <p>Helper types that transform existing types into new types.</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="outline">DeepPartial&lt;T&gt;</Badge>
                  <Badge variant="outline">Nullable&lt;T&gt;</Badge>
                  <Badge variant="outline">ValueOf&lt;T&gt;</Badge>
                  <Badge variant="outline">KeysOfType&lt;T, U&gt;</Badge>
                  <Badge variant="outline">FormErrors&lt;T&gt;</Badge>
                  <Badge variant="outline">ReadonlyDeep&lt;T&gt;</Badge>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Type Guards</h3>
                <p>Functions that help TypeScript narrow down types at runtime.</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="outline">isPhysicalProduct</Badge>
                  <Badge variant="outline">isDigitalProduct</Badge>
                  <Badge variant="outline">isSubscriptionProduct</Badge>
                  <Badge variant="outline">isToastNotification</Badge>
                  <Badge variant="outline">isModalNotification</Badge>
                  <Badge variant="outline">isSuccess&lt;T&gt;</Badge>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Conditional Types</h3>
                <p>Types that evaluate to different types based on a condition.</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="outline">ConditionalFeature&lt;Feature, T, F&gt;</Badge>
                  <Badge variant="outline">WithReviews&lt;HasReviews&gt;</Badge>
                  <Badge variant="outline">ExtendedProduct&lt;HasReviews, HasVariants&gt;</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Generic Components tab */}
        <TabsContent value="generics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>GenericList&lt;T&gt;</CardTitle>
                <CardDescription>
                  A flexible list component that works with any data type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GenericList
                  items={sampleProducts}
                  renderItem={(product) => (
                    <div className="py-3">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.description}</div>
                      <div className="mt-1 font-bold">${product.price.toFixed(2)}</div>
                    </div>
                  )}
                  keySelector={(product) => product.id}
                  header={<h3 className="text-lg font-semibold mb-2">Product List</h3>}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>GenericDropdown&lt;T&gt;</CardTitle>
                <CardDescription>
                  A type-safe dropdown that works with any entity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <GenericDropdown
                    items={sampleUsers}
                    value={sampleUsers[0].id}
                    onChange={(value) => {
                      /* handle selection */
                    }}
                    label="Select User"
                    getDisplayText={(user) => `${user.name} (${user.role})`}
                  />

                  <div className="mt-6">
                    <h3 className="text-md font-semibold mb-2">GenericSearchBar&lt;T&gt;</h3>
                    <GenericSearchBar
                      onSearch={(params) => setSearchParams(params)}
                      placeholder="Search products..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Discriminated Unions tab */}
        <TabsContent value="discriminated">
          <Card>
            <CardHeader>
              <CardTitle>Discriminated Unions Pattern</CardTitle>
              <CardDescription>
                Type narrowing based on discriminator properties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sampleNotifications.map(notification => (
                  <Card key={notification.id} className="bg-gray-50 dark:bg-gray-800/50">
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-md">{notification.title}</CardTitle>
                        <Badge>
                          {/* Using type guards to narrow down the notification type */}
                          {isToastNotification(notification) ? 'Toast' : 
                           isModalNotification(notification) ? 'Modal' : 'In-app'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm mb-2">{notification.message}</p>
                      
                      {/* Conditional rendering based on notification type */}
                      {isToastNotification(notification) && (
                        <div className="text-xs text-gray-500">
                          Duration: {notification.duration}ms • 
                          Variant: <span className="font-medium">{notification.variant}</span>
                        </div>
                      )}
                      
                      {isModalNotification(notification) && (
                        <div>
                          <div className="text-xs text-gray-500 mb-2">
                            Size: {notification.size}
                          </div>
                          <div className="flex gap-2 mt-2">
                            {notification.actions.map(action => (
                              <Badge 
                                key={action.action}
                                variant={
                                  action.variant === 'destructive' 
                                    ? 'destructive' 
                                    : action.variant === 'secondary'
                                      ? 'outline'
                                      : 'default'
                                }
                                className="text-xs"
                              >
                                {action.label}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {isInAppNotification(notification) && (
                        <div className="text-xs text-gray-500">
                          {notification.link && <div>Link: {notification.link}</div>}
                          {notification.icon && <div>Icon: {notification.icon}</div>}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Utility Types tab */}
        <TabsContent value="utility">
          <Card>
            <CardHeader>
              <CardTitle>Utility Types Pattern</CardTitle>
              <CardDescription>
                Types that transform existing types to create new ones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Product Catalog Using Type Guards</h3>
                  <div className="space-y-4">
                    {sampleProducts.slice(0, 3).map(product => (
                      <Card key={product.id} className="bg-gray-50 dark:bg-gray-800/50">
                        <CardContent className="p-4">
                          <h4 className="font-medium">{product.name}</h4>
                          <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {/* Detect product type and show specific information */}
                            {isPhysicalProduct(product as any) && (
                              <Badge variant="outline" className="mr-2">Physical</Badge>
                            )}
                            {isDigitalProduct(product as any) && (
                              <Badge variant="outline" className="mr-2">Digital</Badge>
                            )}
                            {isSubscriptionProduct(product as any) && (
                              <Badge variant="outline" className="mr-2">Subscription</Badge>
                            )}
                            <span className="font-bold">${product.price.toFixed(2)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Code Examples for Utility Types</h3>
                  <div className="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md font-mono text-sm">
                    <div>
                      <div className="text-blue-500 dark:text-blue-400">// Partial&lt;T&gt;</div>
                      <div>type UpdateUser = Partial&lt;User&gt;;</div>
                      <div className="mt-2 text-gray-600 dark:text-gray-400">// Makes all properties optional</div>
                    </div>
                    
                    <div>
                      <div className="text-blue-500 dark:text-blue-400">// Pick&lt;T, K&gt;</div>
                      <div>type UserCredentials = Pick&lt;User, 'id' | 'email'&gt;;</div>
                      <div className="mt-2 text-gray-600 dark:text-gray-400">// Creates a type with only the specified properties</div>
                    </div>
                    
                    <div>
                      <div className="text-blue-500 dark:text-blue-400">// Omit&lt;T, K&gt;</div>
                      <div>type PublicUser = Omit&lt;User, 'permissions' | 'lastLogin'&gt;;</div>
                      <div className="mt-2 text-gray-600 dark:text-gray-400">// Creates a type without the specified properties</div>
                    </div>
                    
                    <div>
                      <div className="text-blue-500 dark:text-blue-400">// Custom DeepPartial&lt;T&gt;</div>
                      <div>type UpdateNestedUser = DeepPartial&lt;User&gt;;</div>
                      <div className="mt-2 text-gray-600 dark:text-gray-400">// Makes all properties optional recursively</div>
                    </div>
                    
                    <div>
                      <div className="text-blue-500 dark:text-blue-400">// FormErrors&lt;T&gt;</div>
                      <div>type UserFormErrors = FormErrors&lt;User&gt;;</div>
                      <div className="mt-2 text-gray-600 dark:text-gray-400">// Maps each property to a potential error message</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enhanced Products tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Enhanced Products with Advanced TypeScript Patterns</CardTitle>
              <CardDescription>
                A complete implementation using all the TypeScript patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EnhancedProductsComponent 
                title="Product Showcase"
                count={6}
                columns={3}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TypeScriptPatternsDemo;