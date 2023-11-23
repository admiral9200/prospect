import React from 'react';
import NextImage from 'next/image';

type CardProps = {
    bgGradientColors: string;
    imageSrc: string;
    imageAlt: string;
    title: string;
    description: string;
    quote: string;
    quoteTextColor: string;
    author: string;
    authorAffiliation: string;
}

const Card: React.FC<CardProps> = ({ 
    bgGradientColors, 
    imageSrc, 
    imageAlt, 
    title, 
    description, 
    quote, 
    quoteTextColor, 
    author, 
    authorAffiliation 
}) => {
    return (
        <div id="card" className={`flex flex-col ${bgGradientColors} p-4 rounded-lg mb-16`}>
            <div id="image">
                <NextImage 
                    src={imageSrc} 
                    alt={imageAlt}
                    layout="responsive"
                    width={500}  // adjust according to your needs
                    height={300} // adjust according to your needs
                    objectFit="cover"
                />
            </div>
            <div id="text-section" className="flex flex-col items-start mt-4 px-16 pb-12">
                <div id="top-section" className="flex flex-col items-start">
                    <h2 className="text-3xl mb-2 font-bold font-sans opacity-">{title}</h2>
                    <p className="text-base mb-4">{description}</p>
                    <hr className="w-1/6 border-gray-300 mb-4"/>
                </div>
                <div id="quote-section" className="flex flex-col items-start mt-4">
                    <p className={`font-sans text-xl font-medium mb-4 ${quoteTextColor}`}>{quote}</p>
                    <div id="final-text-section" className="flex items-start mt-2">
                        <p className="text-xl mr-2 font-indie-flower">{author}</p>
                        <p className="text-sm font-mono self-end mb-2">{authorAffiliation}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


const Features: React.FC = () => {
    return (
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<Card 
    bgGradientColors="bg-gradient-to-r from-green-50 to-green-100"
    imageSrc="/images/traininginsite.svg"
    imageAlt="Chatbot Training"
    title="Effortless Training"
    description="Training your chatbot has never been this effortless. Simply provide an URL, and our AI will do the heavy lifting, learning everything from that website including sub-pages. It's smart, it's simple, it's revolutionary."
    quote="“It would typically take a month to train a customer support rep with the volume of data the bot managed to learn in just 30 seconds. This is truly a game changer. Highly recommended!”"
    quoteTextColor="text-violet-700"
    author="Maïdi Cornelie"
    authorAffiliation="KPMG"
/>
<Card 
    bgGradientColors="bg-gradient-to-r from-green-50 to-green-100"
    imageSrc="/images/integration.svg"
    imageAlt="Chatbot Integration"
    title="Seamless Integration"
    description="Embedding your chatbot is as straightforward as it gets. Copy-pasting a few lines of code is all you need. And the best part? We've got you covered for hosting, scaling, and security. It's always up and running, 24/7."
    quote="“Integration was a smooth process. With only a few lines of code, our website was chatbot ready. It truly doesn't get easier than this!”"
    quoteTextColor="text-violet-700"
    author="Nouredine Abbo"
    authorAffiliation="Dolly Ship"
/>
<Card 
    bgGradientColors="bg-gradient-to-r from-purple-50 to-purple-100"
    imageSrc="/images/workload.png"
    imageAlt="Reduce Workload and Costs"
    title="Reduce Workload and Costs"
    description="Our AI chatbot handles routine customer inquiries, allowing your support team to focus on more complex issues. For important queries, users can still reach out directly to your team via email through the chatbot. It's an efficient solution that saves both time and money."
    quote="“Insite has significantly lightened the load on our customer service team. Our customers get immediate responses to common queries, and our team has more time to address intricate issues. It's a win-win situation!”"
    quoteTextColor="text-purple-700"
    author="Alexandre K."
    authorAffiliation="Witbe"
/>
<Card 
    bgGradientColors="bg-gradient-to-r from-yellow-50 to-yellow-100"
    imageSrc="/images/selfserveyo.png"
    imageAlt="Card Image 4"
    title="Empower Users to Self-Serve"
    description="Insite allows users to help themselves by providing immediate responses to their queries. This self-service option improves customer satisfaction by providing them with quick, precise information whenever they need it."
    quote="“Insite has transformed the way our users receive answers. They appreciate swift, accurate responses and when a human touch is needed, Insite allows us to seamlessly step in. It ensures prompt communication, allowing us to efficiently manage and respond to queries.”"
    quoteTextColor="text-yellow-600"
    author="Mohamed Hachem"
    authorAffiliation="Qonto"
/>


            </div>
        </div>
    )
};

export default Features;
