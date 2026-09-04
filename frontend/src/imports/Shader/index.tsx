import imgImage from "./bdf6ba3377a769f20809e638ba3dd27b7db5d3d3.png";

function Image() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="image">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgImage} />
      </div>
    </div>
  );
}

function StitchShaderStartAnimation2ClassFixedInset0WFullHFull() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-h-px relative w-[390px]" data-name="STITCH_SHADER_START:ANIMATION_2 class='fixed inset-0 w-full h-full">
      <Image />
    </div>
  );
}

export default function Shader() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start relative size-full" data-name="Shader">
      <StitchShaderStartAnimation2ClassFixedInset0WFullHFull />
    </div>
  );
}