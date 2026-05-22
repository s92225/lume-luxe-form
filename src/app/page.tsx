import ConsignmentForm from "@/components/ConsignmentForm";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center min-h-screen">
      <main className="w-full max-w-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border border-[#eceae4] rounded-xl p-6 mb-6 bg-white/50">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1c1c1c] mb-3">
            Consignment Agreement Form: LUME LUXE
          </h1>
          <div className="text-sm text-[#5f5f5d] space-y-1">
            <p>Whatsapp: 93148873</p>
            <p>IG: LUMELUXEHK</p>
            <p>地址: 尖沙咀北京道53-63號 國都大廈13樓1305 E1室</p>
          </div>
          <p className="text-xs text-red-500 mt-3">* 表示必填問題</p>
        </div>

        {/* Form */}
        <ConsignmentForm />
      </main>
    </div>
  );
}
