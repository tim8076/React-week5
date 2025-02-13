import {
  getProducts,
} from '../../connection/connection';
import { useEffect, useState } from 'react';
import { alertError } from '../../tools/sweetAlert';
import TheLoader from '../../components/TheLoader';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const getProductList = async () => {
    setIsLoading(true);
    try {
      const res = await getProducts();
      setProducts(res.data.products);
    } catch(error) {
      alertError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    getProductList();
  }, []);

  

  return (
    <>
      <TheLoader type="spin" color="#fd7e14" isLoading={isLoading} />
      <div className="container py-5">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={15}
          slidesPerView={2.5}
          navigation
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
        >  
          {
            products.map(product => (
              <SwiperSlide key={product.id}>
                <img src={product.imageUrl}
                  alt={product.title}
                  className='img-fluid object-fit-cover'
                  style={{
                    height: '50vh',
                    width: '100%',
                  }}/>
              </SwiperSlide>
            ))
          }
        </Swiper>
      </div>
    </>
  );
}
