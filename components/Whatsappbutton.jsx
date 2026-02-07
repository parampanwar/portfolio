import Image from 'next/image';
import Link from 'next/link';

const Whatsappbutton = () => {
    const message = encodeURIComponent("Hi, I have seen your website and would like to connect!");
    const phoneNumber = "918278636404";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    return (
        <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
            <Link 
                href={whatsappUrl} 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                style={{ 
                    backgroundColor: '#25D366',
                    display: 'flex', // Ensures it's not hidden by layout logic
                    position: 'relative' // Creates a new stacking context
                }}
            >
                <Image 
                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
                    alt="WhatsApp" 
                    width={24}
                    height={24}
                    className="brightness-0 invert" 
                />
                <span className="text-white font-bold text-sm select-none">
                    Chat with me
                </span>
            </Link>
        </div>
    );
};

export default Whatsappbutton;