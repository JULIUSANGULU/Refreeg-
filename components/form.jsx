// components/form.js
'use client';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
    Box,
    Button,
    FormControl,
    Input,
    Select,
    Text,
    VStack,
    Radio,
    RadioGroup,
    FormErrorMessage,
} from '@chakra-ui/react';
import Image from 'next/image';
import { FormProgressBar } from './progressBar';
import { ChevronRight } from 'lucide-react'

const bookSchema = z.object({
    title: z.string().min(1, 'Book title is required'),
    author: z.string().min(1, 'Author name is required'),
    condition: z.enum(['new', 'gently used', 'well used'], {
        errorMap: () => ({ message: 'Condition is required' }),
    }),
    numberOfBooks: z.number().min(1, 'At least one book must be donated').max(100, 'Max 100 books'),
});

export const BookDonationForm = ({ formData, onFormDataChange, step }) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(bookSchema),
        defaultValues: formData,
    });

    const onSubmit = (data) => {
        const bookdata = {
            title: data.title,
            author: data.author,
            condition: data.condition,
            numberOfBooks: data.numberOfBooks
        }
        onFormDataChange(bookdata);
        const params = new URLSearchParams(searchParams);
        params.set('step', step + 1);
        replace(`${pathname}?${params.toString()}`);
    };



    return (
        <Box
            display="flex"
            alignItems="center"
            p={6}
            maxWidth="800px"  // Set maximum width
            mx="auto"          // Center the form horizontally
        >
            <Image src={'/book.svg'} className='hidden md:block' alt="Book Image" width={200} height={200} />
            <VStack spacing={4} as="form" onSubmit={handleSubmit(onSubmit)} flex="1" ml={4}>
                <FormProgressBar currentStep={step} />
                <Text fontSize="xl" mb={4}>Book Donation Form</Text>

                <FormControl isInvalid={!!errors.title}>
                    <Controller
                        name="title"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="title"
                                placeholder="Enter book title"
                                borderBottom="1.5px solid"
                                borderColor={errors.title ? 'red.500' : 'gray.300'}
                                outline="none"
                                variant={'flushed'}
                                {...field}
                            />
                        )}
                    />
                    <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.author}>
                    <Controller
                        name="author"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="author"
                                placeholder="Enter author name"
                                borderBottom="1.5px solid"
                                borderColor={errors.author ? 'red.500' : 'gray.300'}
                                outline="none"
                                variant={'flushed'}
                                {...field}
                            />
                        )}
                    />
                    <FormErrorMessage>{errors.author?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.condition}>
                    <Controller
                        name="condition"
                        control={control}
                        render={({ field }) => (
                            <Select
                                id="condition"
                                placeholder="Select condition"
                                borderBottom="1.5px solid"
                                borderColor={errors.condition ? 'red.500' : 'gray.300'}
                                variant={'flushed'}
                                {...field}
                            >
                                <option value="new">New</option>
                                <option value="gently used">Gently Used</option>
                                <option value="well used">Well Used</option>
                            </Select>
                        )}
                    />
                    <FormErrorMessage>{errors.condition?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.numberOfBooks}>
                    <Controller
                        name="numberOfBooks"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="numberOfBooks"
                                type="number"
                                placeholder="Enter number of books"
                                borderBottom="1.5px solid"
                                borderColor={errors.numberOfBooks ? 'red.500' : 'gray.300'}
                                outline="none"
                                variant={'flushed'}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    field.onChange(value);
                                }}
                                value={field.value || ''}
                            />
                        )}
                    />
                    <FormErrorMessage>{errors.numberOfBooks?.message}</FormErrorMessage>
                </FormControl>
                <div className=' flex justify-between'>


                    <Button type="submit" colorScheme="teal">Next</Button>
                </div>
            </VStack>
        </Box>
    );
};

const imageSchema = z.object({
    image: z.instanceof(File).nullable().refine(file => file !== null, {
        message: 'Image is required',
    }),
});
export const ImageUploadForm = ({ onFormDataChange, step }) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(imageSchema),
    });

    const [imageUploaded, setImageUploaded] = useState(false); // State to track if an image is uploaded

    const onSubmit = (data) => {
        const imgData = { img: data.image }
        onFormDataChange(imgData);
        const params = new URLSearchParams(searchParams);
        params.set('step', step + 1);
        replace(`${pathname}?${params.toString()}`);
    };
    const handlePrev = () => {
        const params = new URLSearchParams(searchParams);
        params.set('step', step - 1);
        replace(`${pathname}?${params.toString()}`);
    }
    const handleNext = () => {
        const params = new URLSearchParams(searchParams);
        params.set('step', step + 1);
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <Box
            display="flex"
            alignItems="center"
            p={6}
            maxWidth="800px"  // Set maximum width
            mx="auto"          // Center the form horizontally
        >
            <Image src={'/book.svg'} className='hidden md:block' alt="Upload Image" width={200} height={200} />
            <VStack spacing={4} as="form" onSubmit={handleSubmit(onSubmit)} flex="1" ml={4}>
                <div className=' flex  w-full justify-between'>

                    <FormProgressBar currentStep={step} />

                    <p className=' cursor-pointer text-primaryShades-700 flex items-center' onClick={handleNext}> Skip this Step <ChevronRight /></p>
                </div>
                <Text fontSize="xl" mb={4}>Upload Image of Books</Text>
                <Text mb={2} fontSize="md">Add a clear photo of the book cover to help others recognize it.</Text>
                <FormControl isInvalid={!!errors.image}>
                    <Controller
                        name="image"
                        control={control}
                        render={({ field: { onChange } }) => (
                            <Box position="relative">
                                {/* Styled upload box */}
                                <Box
                                    width="100%"
                                    maxWidth="600px"  // Keep it responsive
                                    height="250px"  // Adjust box height
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    className='border border-gray-400 bg-primaryShades-400/10'  // Dashed border to indicate drag-and-drop area
                                    backgroundColor="#F9FAFB"  // Soft background for contrast
                                    borderRadius="8px"  // Slightly rounded corners
                                    position="relative"
                                    cursor="pointer"
                                    transition="background-color 0.3s ease"
                                    _hover={{ backgroundColor: '#F3F4F6' }}  // Change background on hover
                                    onClick={() => document.getElementById('image').click()}  // Programmatically open file input
                                >
                                    {/* Invisible input */}
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            // Check if file is being detected
                                            onChange(file);  // Pass file to react-hook-form
                                            if (file) setImageUploaded(true);  // Set state to true if file is uploaded
                                        }}
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            opacity: 0,
                                        }}
                                    />
                                    {/* Content inside the box centered */}
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                        justifyContent="center"
                                        textAlign="center"
                                    >
                                        <Image
                                            src={imageUploaded ? '/cloud-full.svg' : '/cloud.svg'}  // Change image based on upload state
                                            alt="Upload Icon"
                                            width={80}  // Adjusted icon size
                                            height={80}  // Adjusted icon size
                                        />
                                        <Text color="gray.600" mt={2}>
                                            {imageUploaded ? 'Image uploaded!' : 'Click or drag & drop to upload'}
                                        </Text>
                                        <Text color="gray.400" fontSize="sm">
                                            (Max file size: 10MB)
                                        </Text>
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    />
                    <FormErrorMessage>{errors.image?.message}</FormErrorMessage>
                </FormControl>

                <div className=' flex w-full justify-between'>

                    <Button colorScheme="teal" onClick={handlePrev} >Prev</Button>
                    <Button type="submit" colorScheme="teal">Next</Button>
                </div>

            </VStack>
        </Box>
    );
};

const deliverySchema = z.object({
    deliveryMethod: z.string().nonempty('Please select a delivery method'),
});

export const IsDeliveryForm = ({ onFormDataChange, step }) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(deliverySchema),
    });
    const handlePrev = () => {
        const params = new URLSearchParams(searchParams);
        params.set('step', step - 1);
        replace(`${pathname}?${params.toString()}`);
    }

    const onSubmit = (data) => {
        console.log(data);
        onFormDataChange({ deliveryMethod: data.deliveryMethod });
        const params = new URLSearchParams(searchParams);
        params.set('step', step + 1);
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <Box
            display="flex"
            alignItems="center"
            p={6}
            maxWidth="800px"  // Set maximum width
            mx="auto"          // Center the form horizontally
        >
            <Image src={'/book.svg'} className='hidden md:block' alt="Upload Image" width={200} height={200} />
            <VStack spacing={10} as="form" onSubmit={handleSubmit(onSubmit)} flex="1">
                <Text fontSize="xl" mb={4}>How will we receive the books?</Text>
                <Controller
                    name="deliveryMethod"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <RadioGroup {...field} className=' flex' onChange={field.onChange}>

                            <div className=' flex space-x-20' >
                                <Box textAlign="center">
                                    <Radio value="delivery" size="lg">
                                        <Image src={'/deliver.svg'} alt="Delivery" width={100} height={100} />
                                    </Radio>
                                    <Text>Delivery</Text>
                                </Box>
                                <Box textAlign="center">
                                    <Radio value="pickup" size="lg">
                                        <Image src={'/pickup.svg'} alt="Pickup" width={100} height={100} />
                                    </Radio>
                                    <Text>Pickup</Text>
                                </Box>
                            </div>
                        </RadioGroup>
                    )}
                />
                {errors.deliveryMethod && <Text color="red.500">{errors.deliveryMethod.message}</Text>}

              
                <div className=' lg:px-28 flex w-full justify-between'>

                    <Button colorScheme="teal" onClick={handlePrev} >Prev</Button>
                    <Button type="submit" colorScheme="teal">Next</Button>
                </div>
            </VStack>
        </Box>
    );
};