import { Layout } from "@/components/layout/layout";
import { mockInventory } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, Trash2, User, CreditCard, Printer, Plus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function Sales() {
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const addToCart = (product: any) => {
    setCart([...cart, { ...product, qty: 1 }]);
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const total = cart.reduce((acc, item) => acc + item.sellPrice, 0);
  const tax = 0; // No tax in simple simplified logic
  const finalTotal = total + tax;

  const filteredProducts = mockInventory.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="فروش و صدور بل (POS)">
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)]">
        {/* Left Side: Product Selection */}
        <div className="flex-1 flex flex-col gap-4">
          <Card className="flex-1 flex flex-col shadow-sm border-0 bg-muted/30">
            <CardHeader className="pb-2">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="جستجو جنس (نام، مدل، سریال)..." 
                  className="pr-9 bg-background" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-4 pt-0 overflow-hidden">
               <ScrollArea className="h-full pr-4">
                 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                   {filteredProducts.map((product) => (
                     <div 
                        key={product.id} 
                        className="bg-background border rounded-xl p-4 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
                        onClick={() => addToCart(product)}
                     >
                       <div className="flex justify-between items-start mb-2">
                         <Badge variant="outline" className="bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                           {product.stock} موجود
                         </Badge>
                         <span className="font-bold text-lg">${product.sellPrice}</span>
                       </div>
                       <h3 className="font-medium truncate">{product.name}</h3>
                       <p className="text-sm text-muted-foreground">{product.model} - {product.color}</p>
                     </div>
                   ))}
                 </div>
               </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Cart & Checkout */}
        <div className="w-full lg:w-[400px] flex flex-col gap-4">
          <Card className="flex-1 flex flex-col shadow-xl border-t-4 border-t-primary">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingCart className="w-5 h-5 text-primary" />
                سبد خرید
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4 max-h-[400px]">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-muted-foreground opacity-50">
                    <ShoppingBag className="w-12 h-12 mb-2" />
                    <p>سبد خرید خالی است</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-muted/20 p-3 rounded-lg border border-dashed">
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.model}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-sm">${item.sellPrice}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => removeFromCart(idx)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              
              <div className="p-4 bg-muted/30 border-t space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                     <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input placeholder="نام مشتری" className="pr-9 bg-background" />
                  </div>
                  <div className="relative">
                     <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input placeholder="مبلغ دریافتی (پیش‌پرداخت)" type="number" className="pr-9 bg-background" />
                  </div>
                </div>

                <Separator />
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">تعداد اقلام:</span>
                    <span>{cart.length}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>مجموع قابل پرداخت:</span>
                    <span className="text-primary">${finalTotal}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button variant="outline" className="gap-2">
                    <Printer className="w-4 h-4" />
                    چاپ پیش‌فاکتور
                  </Button>
                  <Button className="gap-2 shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4" />
                    ثبت نهایی
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

function ShoppingBag(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}
