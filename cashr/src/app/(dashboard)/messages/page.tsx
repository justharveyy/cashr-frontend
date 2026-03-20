export default function MessagesPage() {
  return (
    <div className="-mx-8 -mt-24 -mb-12">
      <div className="flex h-screen pt-16">
        {/* Left Pane: Conversation List */}
        <section className="w-80 flex flex-col border-r border-slate-200 bg-white">
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-xl font-bold tracking-tighter text-primary mb-4">
              CRM Inbox
            </h2>
            <div className="flex gap-2 overflow-x-auto">
              <button className="px-4 py-1.5 bg-primary text-on-primary rounded-full text-xs font-bold whitespace-nowrap">
                All Chats
              </button>
              <button className="px-4 py-1.5 bg-surface-container text-on-surface-variant rounded-full text-xs font-medium whitespace-nowrap">
                New
              </button>
              <button className="px-4 py-1.5 bg-surface-container text-on-surface-variant rounded-full text-xs font-medium whitespace-nowrap">
                Shipping
              </button>
            </div>
          </div>
          <div className="flex-grow overflow-y-auto">
            {/* Active Conversation */}
            <div className="p-4 bg-primary/5 border-l-4 border-primary cursor-pointer">
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-on-surface">Phan Minh Anh</span>
                <span className="text-[10px] text-slate-400">12:45 PM</span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-1 mb-2">
                Can I upgrade my shipping to express for order #8291?
              </p>
              <span className="px-2 py-0.5 bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold rounded uppercase">
                Inquiry
              </span>
            </div>
            {/* Other Conversations */}
            {[
              {
                name: "Le Quoc Huy",
                time: "Yesterday",
                msg: "Thank you! The package arrived safely.",
                tag: "Resolved",
                tagClass:
                  "bg-surface-container-highest text-on-surface-variant",
              },
              {
                name: "Nguyen Thi Lan",
                time: "Tue",
                msg: "Is the Silk Ao Dai available in Medium size?",
                tag: "Product",
                tagClass: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
              },
              {
                name: "Tran Van Duc",
                time: "Mon",
                msg: "I'd like to return order #CSR-8712 please.",
                tag: "Return",
                tagClass: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
              },
              {
                name: "Vo Thanh Mai",
                time: "Sun",
                msg: "Do you ship to Phu Quoc island?",
                tag: "Shipping",
                tagClass: "bg-secondary-fixed text-on-secondary-fixed",
              },
            ].map((convo) => (
              <div
                key={convo.name}
                className="p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-on-surface">{convo.name}</span>
                  <span className="text-[10px] text-slate-400">
                    {convo.time}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1 mb-2">
                  {convo.msg}
                </p>
                <span
                  className={`px-2 py-0.5 ${convo.tagClass} text-[10px] font-bold rounded uppercase`}
                >
                  {convo.tag}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Center Pane: Chat Window */}
        <section className="flex-grow flex flex-col bg-slate-50 relative">
          {/* Chat Header */}
          <div className="px-8 py-4 bg-white/80 backdrop-blur-md sticky top-16 z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-fixed-dim flex items-center justify-center font-bold text-primary">
                PM
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">
                  Phan Minh Anh
                </h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter">
                    Online - Ho Chi Minh City
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-surface-container-low rounded-lg text-slate-600 hover:bg-primary-fixed hover:text-primary transition-colors">
                <span className="material-symbols-outlined">call</span>
              </button>
              <button className="p-2 bg-surface-container-low rounded-lg text-slate-600">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-8 space-y-6">
            <div className="flex flex-col items-center">
              <span className="px-4 py-1 bg-surface-container-highest/50 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                March 21, 2026
              </span>
            </div>
            {/* Customer Message */}
            <div className="flex gap-4 max-w-lg">
              <div className="flex-grow">
                <div className="bg-white p-4 rounded-xl rounded-tl-none shadow-sm text-sm leading-relaxed text-on-surface">
                  Hello, I recently ordered the Premium Ceramic Tea Set (Order
                  #8291). I noticed the shipping is standard.
                  <br />
                  <br />
                  Is it possible to upgrade to{" "}
                  <strong>Express Delivery</strong>? I need it for a gift this
                  weekend.
                </div>
                <span className="text-[10px] text-slate-400 mt-2 block">
                  12:42 PM
                </span>
              </div>
            </div>
            {/* Merchant Reply */}
            <div className="flex gap-4 max-w-lg ml-auto justify-end">
              <div className="flex flex-col items-end">
                <div className="bg-primary text-on-primary p-4 rounded-xl rounded-tr-none shadow-lg shadow-primary/10 text-sm leading-relaxed">
                  Hello Anh! Let me check that for you right away. Our express
                  shipping usually takes 24 hours within the city.
                </div>
                <span className="text-[10px] text-slate-400 mt-2 block">
                  12:44 PM - Read
                </span>
              </div>
            </div>
            {/* Smart Suggestion */}
            <div className="flex justify-center my-8">
              <div className="bg-secondary-container/10 border border-primary/10 p-6 rounded-2xl max-w-md w-full backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary text-lg">
                    auto_awesome
                  </span>
                  <span className="text-xs font-black uppercase tracking-widest text-primary">
                    Smart Suggestions
                  </span>
                </div>
                <div className="flex gap-4 items-center p-3 bg-white rounded-xl shadow-sm">
                  <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-2xl">
                      local_shipping
                    </span>
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-sm font-bold">
                      Express Shipping Upgrade
                    </h4>
                    <p className="text-xs text-slate-500">
                      Fast delivery (1-2 days)
                    </p>
                    <span className="text-sm font-black text-primary mt-1 block">
                      50.000 ₫
                    </span>
                  </div>
                  <button className="bg-primary text-on-primary px-3 py-1.5 rounded-lg text-xs font-bold">
                    Offer
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-6 bg-white border-t border-slate-100">
            <div className="flex gap-3 mb-4">
              {[
                '"Yes, we can upgrade it!"',
                '"Express costs 50k extra"',
                '"When do you need it?"',
              ].map((quick) => (
                <button
                  key={quick}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold border border-blue-100"
                >
                  {quick}
                </button>
              ))}
            </div>
            <div className="bg-surface-container-low rounded-2xl p-2 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <textarea
                className="w-full bg-transparent border-none focus:ring-0 text-sm p-3 resize-none h-20 outline-none"
                placeholder="Type your message here..."
              />
              <div className="flex items-center justify-between px-2 pb-1">
                <div className="flex gap-1">
                  {["format_bold", "image", "attach_file", "sentiment_satisfied"].map(
                    (icon) => (
                      <button
                        key={icon}
                        className="p-2 text-slate-400 hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">
                          {icon}
                        </span>
                      </button>
                    )
                  )}
                </div>
                <button className="bg-primary text-on-primary px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2">
                  Send
                  <span className="material-symbols-outlined text-sm">
                    send
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Right Pane: Customer Insights */}
        <section className="w-96 bg-white overflow-y-auto border-l border-slate-100">
          <div className="p-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
              Customer Profile
            </h3>
            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-surface-container-low p-4 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  Total Spend
                </span>
                <div className="text-xl font-black text-primary mt-1">
                  14.2M ₫
                </div>
              </div>
              <div className="bg-surface-container-low p-4 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  Orders
                </span>
                <div className="text-xl font-black text-primary mt-1">12</div>
              </div>
              <div className="col-span-2 bg-primary-container text-on-primary-container p-4 rounded-2xl">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase opacity-80">
                    Frequency
                  </span>
                  <span className="px-2 py-0.5 bg-white/20 rounded text-[10px] font-bold">
                    TOP 5%
                  </span>
                </div>
                <div className="text-lg font-bold mt-1">Every 14 Days</div>
              </div>
            </div>

            {/* Active Cart */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-4">
                <h4 className="text-sm font-black uppercase tracking-wider">
                  Active Cart
                </h4>
                <span className="text-[10px] font-bold text-primary">
                  2 ITEMS
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                  <div className="w-10 h-10 bg-white rounded-lg p-1 border border-outline-variant/15 flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-lg">
                      local_cafe
                    </span>
                  </div>
                  <div className="flex-grow">
                    <div className="text-xs font-bold leading-none">
                      Premium Ceramic Tea Set
                    </div>
                    <span className="text-[10px] text-slate-500">
                      Quantity: 1
                    </span>
                  </div>
                  <span className="text-xs font-bold">680k</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                  <div className="w-10 h-10 bg-white rounded-lg p-1 border border-outline-variant/15 flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-lg">
                      restaurant
                    </span>
                  </div>
                  <div className="flex-grow">
                    <div className="text-xs font-bold leading-none">
                      Handcrafted Spoon Set
                    </div>
                    <span className="text-[10px] text-slate-500">
                      Quantity: 1
                    </span>
                  </div>
                  <span className="text-xs font-bold">280k</span>
                </div>
              </div>
            </div>

            {/* Merchant Controls */}
            <div className="space-y-3">
              <h4 className="text-sm font-black uppercase tracking-wider mb-4">
                Merchant Controls
              </h4>
              <button className="w-full flex items-center justify-between p-4 bg-secondary-fixed text-on-secondary-fixed font-bold rounded-xl hover:bg-secondary-fixed-dim transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">loyalty</span>
                  <span className="text-sm">Apply Loyalty Discount</span>
                </div>
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-surface-container-low text-on-surface font-bold rounded-xl hover:bg-slate-200 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">
                    local_shipping
                  </span>
                  <span className="text-sm">Update Delivery Info</span>
                </div>
                <span className="material-symbols-outlined">edit</span>
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-surface-container-low text-on-surface font-bold rounded-xl hover:bg-slate-200 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">history</span>
                  <span className="text-sm">Full Order History</span>
                </div>
                <span className="material-symbols-outlined">open_in_new</span>
              </button>
            </div>

            {/* Tags */}
            <div className="mt-8 pt-8 border-t border-slate-100">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Internal Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {["VIP_LEVEL_2", "RECURRING_BUYER", "HCMC_SOUTH"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
