export default function MessagesPage() {
  return (
    <div className="-mx-8 -mt-20 -mb-8">
      <div className="flex h-screen pt-14">
        {/* Left Pane: Conversation List */}
        <section className="w-80 flex flex-col border-r border-slate-200 bg-white">
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-base font-semibold text-on-surface mb-3">
              CRM Inbox
            </h2>
            <div className="flex gap-2 overflow-x-auto">
              <button className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium whitespace-nowrap">
                All Chats
              </button>
              <button className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium whitespace-nowrap border border-slate-200">
                New
              </button>
              <button className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium whitespace-nowrap border border-slate-200">
                Shipping
              </button>
            </div>
          </div>
          <div className="flex-grow overflow-y-auto">
            {/* Active Conversation */}
            <div className="p-4 bg-blue-50/50 border-l-3 border-primary cursor-pointer">
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-sm text-on-surface">Phan Minh Anh</span>
                <span className="text-[10px] text-slate-400">12:45 PM</span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1 mb-2">
                Can I upgrade my shipping to express for order #8291?
              </p>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded">
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
                tagClass: "bg-emerald-50 text-emerald-700",
              },
              {
                name: "Nguyen Thi Lan",
                time: "Tue",
                msg: "Is the Silk Ao Dai available in Medium size?",
                tag: "Product",
                tagClass: "bg-amber-50 text-amber-700",
              },
              {
                name: "Tran Van Duc",
                time: "Mon",
                msg: "I'd like to return order #CSR-8712 please.",
                tag: "Return",
                tagClass: "bg-red-50 text-red-700",
              },
              {
                name: "Vo Thanh Mai",
                time: "Sun",
                msg: "Do you ship to Phu Quoc island?",
                tag: "Shipping",
                tagClass: "bg-slate-100 text-slate-600",
              },
            ].map((convo) => (
              <div
                key={convo.name}
                className="p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm text-on-surface">{convo.name}</span>
                  <span className="text-[10px] text-slate-400">
                    {convo.time}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1 mb-2">
                  {convo.msg}
                </p>
                <span
                  className={`px-2 py-0.5 ${convo.tagClass} text-[10px] font-semibold rounded`}
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
          <div className="px-6 py-3 bg-white border-b border-slate-200 sticky top-14 z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-semibold text-sm text-slate-600">
                PM
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-tight">
                  Phan Minh Anh
                </h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-[10px] font-medium text-slate-400">
                    Online - Ho Chi Minh City
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
                <span className="material-symbols-outlined text-xl">call</span>
              </button>
              <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
                <span className="material-symbols-outlined text-xl">more_vert</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-6 space-y-5">
            <div className="flex flex-col items-center">
              <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-medium text-slate-400">
                March 21, 2026
              </span>
            </div>
            {/* Customer Message */}
            <div className="flex gap-3 max-w-lg">
              <div className="flex-grow">
                <div className="bg-white p-4 rounded-lg rounded-tl-none border border-slate-200 text-sm leading-relaxed text-on-surface">
                  Hello, I recently ordered the Premium Ceramic Tea Set (Order
                  #8291). I noticed the shipping is standard.
                  <br />
                  <br />
                  Is it possible to upgrade to{" "}
                  <strong>Express Delivery</strong>? I need it for a gift this
                  weekend.
                </div>
                <span className="text-[10px] text-slate-400 mt-1.5 block">
                  12:42 PM
                </span>
              </div>
            </div>
            {/* Merchant Reply */}
            <div className="flex gap-3 max-w-lg ml-auto justify-end">
              <div className="flex flex-col items-end">
                <div className="bg-primary text-white p-4 rounded-lg rounded-tr-none text-sm leading-relaxed">
                  Hello Anh! Let me check that for you right away. Our express
                  shipping usually takes 24 hours within the city.
                </div>
                <span className="text-[10px] text-slate-400 mt-1.5 block">
                  12:44 PM - Read
                </span>
              </div>
            </div>
            {/* Smart Suggestion */}
            <div className="flex justify-center my-6">
              <div className="bg-white border border-slate-200 p-5 rounded-lg max-w-md w-full">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-primary text-lg">
                    auto_awesome
                  </span>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Smart Suggestions
                  </span>
                </div>
                <div className="flex gap-3 items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-2xl">
                      local_shipping
                    </span>
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-sm font-medium">
                      Express Shipping Upgrade
                    </h4>
                    <p className="text-xs text-slate-400">
                      Fast delivery (1-2 days)
                    </p>
                    <span className="text-sm font-semibold text-primary mt-0.5 block">
                      50.000 ₫
                    </span>
                  </div>
                  <button className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-medium">
                    Offer
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-5 bg-white border-t border-slate-200">
            <div className="flex gap-2 mb-3">
              {[
                '"Yes, we can upgrade it!"',
                '"Express costs 50k extra"',
                '"When do you need it?"',
              ].map((quick) => (
                <button
                  key={quick}
                  className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-medium border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  {quick}
                </button>
              ))}
            </div>
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all">
              <textarea
                className="w-full bg-transparent border-none focus:ring-0 text-sm p-2 resize-none h-16 outline-none placeholder:text-slate-400"
                placeholder="Type your message here..."
              />
              <div className="flex items-center justify-between px-2 pb-1">
                <div className="flex gap-1">
                  {["format_bold", "image", "attach_file", "sentiment_satisfied"].map(
                    (icon) => (
                      <button
                        key={icon}
                        className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">
                          {icon}
                        </span>
                      </button>
                    )
                  )}
                </div>
                <button className="bg-primary text-white px-4 py-1.5 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-primary-container transition-colors">
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
        <section className="w-80 bg-white overflow-y-auto border-l border-slate-200">
          <div className="p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-5">
              Customer Profile
            </h3>
            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-[10px] font-medium text-slate-400 uppercase">
                  Total Spend
                </span>
                <div className="text-lg font-bold text-on-surface mt-0.5">
                  14.2M ₫
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-[10px] font-medium text-slate-400 uppercase">
                  Orders
                </span>
                <div className="text-lg font-bold text-on-surface mt-0.5">12</div>
              </div>
              <div className="col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-medium text-slate-400 uppercase">
                    Frequency
                  </span>
                  <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded text-[10px] font-semibold">
                    TOP 5%
                  </span>
                </div>
                <div className="text-sm font-semibold mt-0.5">Every 14 Days</div>
              </div>
            </div>

            {/* Active Cart */}
            <div className="mb-6">
              <div className="flex justify-between items-end mb-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Active Cart
                </h4>
                <span className="text-[10px] font-medium text-primary">
                  2 Items
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="w-9 h-9 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-lg">
                      local_cafe
                    </span>
                  </div>
                  <div className="flex-grow">
                    <div className="text-xs font-medium leading-none">
                      Premium Ceramic Tea Set
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Quantity: 1
                    </span>
                  </div>
                  <span className="text-xs font-medium">680k</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="w-9 h-9 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-lg">
                      restaurant
                    </span>
                  </div>
                  <div className="flex-grow">
                    <div className="text-xs font-medium leading-none">
                      Handcrafted Spoon Set
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Quantity: 1
                    </span>
                  </div>
                  <span className="text-xs font-medium">280k</span>
                </div>
              </div>
            </div>

            {/* Merchant Controls */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                Merchant Controls
              </h4>
              <button className="w-full flex items-center justify-between p-3 bg-slate-50 text-on-surface font-medium rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-lg text-slate-500">loyalty</span>
                  <span className="text-sm">Apply Loyalty Discount</span>
                </div>
                <span className="material-symbols-outlined text-sm text-slate-400">chevron_right</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-slate-50 text-on-surface font-medium rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-lg text-slate-500">
                    local_shipping
                  </span>
                  <span className="text-sm">Update Delivery Info</span>
                </div>
                <span className="material-symbols-outlined text-sm text-slate-400">edit</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-slate-50 text-on-surface font-medium rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-lg text-slate-500">history</span>
                  <span className="text-sm">Full Order History</span>
                </div>
                <span className="material-symbols-outlined text-sm text-slate-400">open_in_new</span>
              </button>
            </div>

            {/* Tags */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h4 className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-2">
                Internal Tags
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {["VIP_LEVEL_2", "RECURRING_BUYER", "HCMC_SOUTH"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-medium rounded"
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
