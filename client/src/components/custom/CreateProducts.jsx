import React, { useRef, useState } from 'react';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Loader2, Upload, X } from 'lucide-react';
import { Colors } from '@/constants/colors';
import { useToast } from '@/hooks/use-toast';
import useErrorLogout from '@/hooks/use-error-logout';
import axios from 'axios';
import { useDispatch } from 'react-redux';

const CreateProducts = () => {
    const [currentColors, setCurrentColors] = useState("#000000");
    const [colors, setColors] = useState([]);
    const [images, setImages] = useState([]);
    const fileInputRef = useRef(null);
    const [category, setCategory] = useState(''); // Fixed initialization
    const [isLoading, setIsLoading] = useState(false);

    const { toast } = useToast();
    const { handleErrorLogout } = useErrorLogout();
    const dispatch = useDispatch();

    const addColor = () => {
        if (!colors.includes(currentColors)) {
            setColors([...colors, currentColors]);
        }
    };

    const removeColor = (colorToRemove) => {
        setColors(colors.filter((color) => color !== colorToRemove));
    };

    const removeImages = (indexToRemoveImg) => {
        setImages(images.filter((_, index) => index !== indexToRemoveImg));
    };

    const handleImageUpload = (e) => {
        const files = e.target.files;
        if (files) {
            const newImages = Array.from(files).map((file) => ({
                preview: URL.createObjectURL(file),
                file
            }));
            setImages((prevImages)=>[...prevImages, ...newImages].slice(0, 4));
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const name = e.target.name.value;
        const description = e.target.description.value;
        const price = e.target.price.value;
        const stock = e.target.stock.value;

        if (!name || !description || !price || !stock || !category) {
            return toast({
                title: "Error",
                description: "Please fill out all fields"
            });
        }

        if (name.trim() === "" || description.trim() === "" || price <= 0 || stock <= 0) {
            return toast({
                title: "Error",
                description: "Invalid field values"
            });
        }

        if (images.length < 4) {
            return toast({
                title: "Error",
                description: "Please upload at least 4 images"
            });
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("stock", stock);
        formData.append("category", category.charAt(0).toUpperCase()+category.slice(1));
        colors.forEach((color) => formData.append("colors", color));
        images.forEach((image) => formData.append("images", image.file));

        try {
            const res = await axios.post(
                import.meta.env.VITE_API_URL+"/create-product",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                }
            );

            toast({
                title: "Success",
                description: res.data.message,
                variant: "default"
            });
        } catch (error) {
            handleErrorLogout(error, "Error uploading product");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className='flex items-center justify-center absolute inset-0'>
                <Loader2 className='h-12 w-12 animate-spin' />
            </div>
        );
    }

    return (
        <div className='w-full max-w-2xl -z-10'>
            <CardHeader>
                <CardTitle className="text-2xl">Add New Product</CardTitle>
                <CardDescription>
                    Enter the details for the new product you want to add to your e-commerce store.
                </CardDescription>
            </CardHeader>

            <form onSubmit={onSubmit}>
                <div className='flex flex-col lg:flex-row lg:w-[70vw]'>
                    <CardContent className="w-full">
                        <div className='space-y-2'>
                            <Label htmlFor="name">Product Name</Label>
                            <Input id="name" name="name" type="text" placeholder="Enter Product Name" />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor="description">Product Description</Label>
                            <Textarea id="description" name="description" placeholder="Product Description" />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor="price">Product Price</Label>
                            <Input id="price" name="price" type="number" step="0.01" min="0" placeholder="0.00" />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor="stock">Stock</Label>
                            <Input id="stock" name='stock' type="number" placeholder="20" />
                        </div>
                    </CardContent>

                    <CardContent className="w-full">
                        <div className='space-y-2'>
                            <Label htmlFor="category">Category</Label>
                            {/* Fixed Select component */}
                            <Select 
                                name="category" 
                                id="category"
                                value={category}
                                onValueChange={setCategory}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="headset">Headset</SelectItem>
                                    <SelectItem value="mouse">Mouse</SelectItem>
                                    <SelectItem value="keyboard">Keyboard</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='space-y-2 gap-2'>
                            <Label htmlFor="color">Colors</Label>
                            <div className="flex space-x-2">
                                <Input
                                    type="color"
                                    value={currentColors}
                                    onChange={(e) => setCurrentColors(e.target.value)}
                                    className="w-12 h-12 p-1 rounded-md"
                                />
                                <Button variant="outline" onClick={addColor}>
                                    Add Color
                                </Button>
                            </div>
                        </div>

                        <div className='flex flex-wrap gap-2 mt-2'>
                            {colors.map((color, index) => (
                                <div key={index} className='flex items-center bg-gray-100 rounded-full pl-2 pr-1 py-1'>
                                    <div className='w-4 h-4 rounded-full mr-2' style={{ backgroundColor: color }} />
                                    <span className='text-sm mr-1 dark:text-slate-900' style={{ color: Colors.customBlack }}>
                                        {color}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        className="w-6 h-6 p-0 rounded-full"
                                        onClick={() => removeColor(color)}
                                    >
                                        <X className='w-4 h-4' />
                                        <span className='sr-only'>Remove color</span>
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor="image">Product Image</Label>
                            <div className="flex flex-wrap gap-4">
                                {images.map((image, index) => (
                                    <div className="relative" key={index}>
                                        <img
                                            src={image?.preview}
                                            alt={`Product image ${index + 1}`}
                                            width={100}
                                            height={100}
                                            className='rounded-md object-cover'
                                        />
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                                            onClick={() => removeImages(index)} // Fixed index
                                        >
                                            <X className='w-4 h-4' />
                                            <span className='sr-only'>Remove image</span>
                                        </Button>
                                    </div>
                                ))}

                                {images.length < 4 && (
                                    <Button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-[100px] h-[100px]"
                                        variant="outline"
                                    >
                                        <Upload className='h-6 w-6' />
                                        <span className='sr-only'>Upload Images</span>
                                    </Button>
                                )}
                            </div>
                            <Input
                                type="file"
                                id="images"
                                name="images"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                ref={fileInputRef}
                                className="hidden"
                            />
                            <p className='text-sm text-muted-foreground mt-2'>
                                Upload up to 4 images. Supported Formats: JPG, PNG, GIF
                            </p>
                        </div>
                    </CardContent>
                </div>

                <CardFooter>
                    {/* Fixed disabled prop */}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                        {isLoading ? "Adding product..." : "Add Product"}
                    </Button>
                </CardFooter>
            </form>
        </div>
    );
};

export default CreateProducts;