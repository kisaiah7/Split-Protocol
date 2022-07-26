type Props = {
  children: React.ReactNode;
};

const DarkOverlay = ({ children }: Props) => {
  return (
    <div className="fixed inset-0 z-10 bg-[#000000aa] flex flex-col justify-center">
      {children}
    </div>
  );
};
export default DarkOverlay;
