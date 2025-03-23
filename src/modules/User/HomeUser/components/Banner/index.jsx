/* eslint-disable react/prop-types */

function Banner({ image, alt = "Banner image" }) {
  return (
    <div className="text-white flex flex-col w-full h-full max-h-[500px] overflow-hidden">
      <img
        src={image}
        alt={alt}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export default Banner;