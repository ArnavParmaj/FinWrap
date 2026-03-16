export default function SplitsPage() {
  return (
    <main className="flex-1 flex flex-col overflow-hidden relative aurora-glow">

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[320px] border-r border-white/5 flex flex-col p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-100">Your Groups</h3>
            <button className="material-icons-outlined text-slate-400 hover:text-white transition-colors">
              filter_list
            </button>
          </div>
          <button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 font-bold text-sm mb-6 transition-all shadow-lg shadow-primary/10">
            <span className="material-icons-outlined text-lg">add_circle</span>
            New Group
          </button>
          <div className="space-y-3">
            <div className="glass-panel p-4 rounded-xl border-l-4 border-l-primary cursor-pointer hover:bg-white/5 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-slate-100">Ski Trip 2024</h4>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-end">
                <div className="flex -space-x-2">
                  <img
                    className="size-7 rounded-full border-2 border-[#080A0F] object-cover"
                    alt="Member avatar Sarah"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYK_Y5Y6NHXQ8uSD6Uzx5MYJvxt94bmUVERBb9zUVJg3X6OIxFCeomM9bMXnImYhGCuR_U4kCi8e013U3HWQrZzcpKRmzqn_wR6j2_fe18utHO2yy7PafIgITE4CwrsBXVohEScrxActSY6wdZTGZcfs1SHfokPAD8_esmw2tAQY6gz3HqrY7i99q5kbVaYQZP2RWZko7E64o808fzy-EOJR2F4869QZLQi5cRzEPst9BE7St9PgMUubWDFsH19LJCQJeyzuT0cyM"
                  />
                  <img
                    className="size-7 rounded-full border-2 border-[#080A0F] object-cover"
                    alt="Member avatar Mark"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnhOLojWJro-OzPgwjugtgH-X1C-DJXyJzUdmX2sYsmQ_PCafR8325cp9P5wCH3kewF3jjlflMTQTZBgZ9doyKqhzJwMSesYreyIPUA6DSegVu_aouwHHuREhk00nsT5kTLE_YSN1xVGsLvnUxxPpF80Qx7Uc9BMOkKhA2N7_VG_zqym8Qt7NTa2-xh6e6IY7iju6YUlczSDsb5DSt153VNpc2eBOUF8-g76bOe_Uc3Y0cONM1bixtL4oMS2Mw4blB3sC1jPOvjuE"
                  />
                  <img
                    className="size-7 rounded-full border-2 border-[#080A0F] object-cover"
                    alt="Member avatar John"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD49ZfoK42THhWuMUW94pp36WBs_5p1B7MKgtnSydEWty-zAvlmY64c67dfH17bianVElZUh-eJhSFyHd1A8fsqthlzLh0EfZp86qNKCOly1gfNOocPsuRzgVO7g3GJx8EYCrdCNogvQylsJdC1OO9-p8-iPQDvIvBKUZsimITY_W_u-k4xrKLIXz-dO3Girx4IndiKn0kdvmXAdWEvJ86pnD6lK9mpeP8QLOPMgqGcRK4c8TVAVG55i3fCQuLBI6YGS7XrIqkP8zY"
                  />
                  <div className="size-7 rounded-full border-2 border-[#080A0F] bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                    +2
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-medium">
                    You are owed
                  </p>
                  <p className="text-emerald-400 font-bold">₹420.50</p>
                </div>
              </div>
            </div>
            <div className="glass-panel p-4 rounded-xl cursor-pointer hover:bg-white/5 transition-colors border-transparent border-l-4">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-slate-100">Daily Coffee</h4>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  2 days ago
                </span>
              </div>
              <div className="flex justify-between items-end">
                <div className="flex -space-x-2">
                  <img
                    className="size-7 rounded-full border-2 border-[#080A0F] object-cover"
                    alt="Member avatar David"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLG0LALYVb85NOABaMesItn8zzu3K08i1EVt5FBD6IgtwBdkgDjvPi3G9aOgaqRg2kg-B_B_3IBDM8wqnRcIKpqTHJB7kpjo5als5tV2SSCv5Ss_JfOIdJYEjDB2Ia3nZUpl_BAK_ejvOOmuaLCikgIWdjXNlGGvdSMVhK3W6sJlWnBVo3PcG-uJxSbzI3GdYGqqJhpo3kGBTtggt2Tu1ajAEc0DW3kWJ7rDMXJX_8uwa6LAaZXFEwSt6gSp8tqpO957sdqphPLU4"
                  />
                  <img
                    className="size-7 rounded-full border-2 border-[#080A0F] object-cover"
                    alt="Member avatar Lisa"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC30o1YsxyR8UeOCWLfpB2mbeFSpUeJsTzQDO8pEKtAd2YaRw1lBBDhbsVip37rY-B-4BRzw4ZJGpSOiGWZ1bcW3_gu_qE16WErskKzzt9-DebvYD9F_Rcm5Cg6KpSzkPykF8dWczsB_5Q3LxrJWVdH0ceQ8xpjv6GM6RQVj4s3CHYWftxLE2WKRpAEsVxj4OuE1L-7fGXtiSdS7zTP4HPp1uJRXdR4DdMwSDYniOH2sBMCckUXQkfu_J29pRYEfW7lh-yEu9yZtDU"
                  />
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-medium">
                    You owe
                  </p>
                  <p className="text-rose-400 font-bold">₹12.80</p>
                </div>
              </div>
            </div>
            <div className="glass-panel p-4 rounded-xl cursor-pointer hover:bg-white/5 transition-colors border-transparent border-l-4">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-slate-100">House Rent</h4>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  Monthly
                </span>
              </div>
              <div className="flex justify-between items-end">
                <div className="flex -space-x-2">
                  <img
                    className="size-7 rounded-full border-2 border-[#080A0F] object-cover"
                    alt="Member avatar Anna"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7CwXZt0I3NUOZl4OAHkyj6qszemJ2KKbkx6N-XoqxKWmyv53tomzKX7kYqksL-j-8F_IhAzJTNyX6lVyzfrOfRNlUnvnOcVptm18ySu8rMlrJaQDuHRUsF_SI9cFGLrmFjoVEG36hegq1MYOsZClPVjp5IHfnq85h8FJiQsXKkIi8jnGC8F-9fstLY1Sjvd3JqiqXzri4GCtHMpoCTNx_TIxiAckFxrDVa7xDHhmF_fcClRHMJPJ7-Xgi3BYKg7A8ax96HYWVUgY"
                  />
                  <img
                    className="size-7 rounded-full border-2 border-[#080A0F] object-cover"
                    alt="Member avatar Mike"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvDcM4BvotD3MUiRWrqy-fB_zksfTRQcRJ-NY-tkYI-HR0s6VcjxddDChh-hsMfJ1N44ZB4zR8x8Y_u99ih9-DpxDaLBh6qWwpLZBCp7H4jSiC_m1nkS78ag1PCDZM1CnS6mlh_MDJ4dwmjLkihbFYHBLk0puLY1glA32KzwvRIATr7maBMjHrS6xnHTs0d-rvhDWk2T4sPqmKSoqzGLhEomOg59bodGqQHdkLRXMOcAaJhhps34Qt0cGQ3zwLQ_BAIBX7dq8yPek"
                  />
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-medium">
                    Settled up
                  </p>
                  <p className="text-slate-400 font-bold">₹0.00</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section className="flex-1 flex flex-col p-8 overflow-y-auto bg-background-dark/50">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-black text-white tracking-tight">
                  Ski Trip 2024
                </h1>
                <span className="material-icons-outlined text-slate-500 cursor-pointer hover:text-white transition-colors">settings</span>
              </div>
              <p className="text-slate-400 text-sm">
                Created Jan 12 • 5 members • Aspen, Colorado
              </p>
            </div>
            <div className="flex gap-4">
              <button className="bg-primary hover:bg-primary/90 text-white rounded-lg h-11 px-6 flex items-center gap-2 font-bold transition-all">
                <span className="material-icons-outlined">receipt_long</span>
                Add Expense
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-10">
            <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
              <div className="size-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <span className="material-icons-outlined text-3xl">trending_up</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">
                  You are owed total
                </p>
                <p className="text-2xl font-black text-emerald-400">₹420.50</p>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
              <div className="size-12 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
                <span className="material-icons-outlined text-3xl">trending_down</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">
                  You owe total
                </p>
                <p className="text-2xl font-black text-rose-400">₹125.00</p>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="material-icons-outlined text-primary">history</span>
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="glass-panel p-4 rounded-xl flex items-center justify-between hover:border-primary/30 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-white/5 flex items-center justify-center">
                    <span className="material-icons-outlined text-slate-400">cottage</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-100 group-hover:text-primary transition-colors">
                      Airbnb Luxury Cabin
                    </h5>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">
                        Paid by Sarah
                      </span>
                      <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                        Split equally
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex items-center gap-8">
                  <div>
                    <p className="text-xs text-slate-500">Total amount</p>
                    <p className="text-lg font-bold text-slate-100">
                      ₹1,250.00
                    </p>
                  </div>
                  <div className="w-24">
                    <p className="text-xs text-slate-500">You owe</p>
                    <p className="text-lg font-bold text-rose-400">₹250.00</p>
                  </div>
                  <button className="material-icons-outlined text-slate-600 hover:text-white transition-colors">
                    more_vert
                  </button>
                </div>
              </div>

              <div className="glass-panel p-4 rounded-xl flex items-center justify-between hover:border-primary/30 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-white/5 flex items-center justify-center">
                    <span className="material-icons-outlined text-slate-400">restaurant</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-100 group-hover:text-primary transition-colors">
                      Group Dinner & Drinks
                    </h5>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">
                        Paid by You
                      </span>
                      <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                        Custom split
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex items-center gap-8">
                  <div>
                    <p className="text-xs text-slate-500">Total amount</p>
                    <p className="text-lg font-bold text-slate-100">₹340.20</p>
                  </div>
                  <div className="w-24">
                    <p className="text-xs text-slate-500">You are owed</p>
                    <p className="text-lg font-bold text-emerald-400">
                      ₹272.16
                    </p>
                  </div>
                  <button className="material-icons-outlined text-slate-600 hover:text-white transition-colors">
                    more_vert
                  </button>
                </div>
              </div>

              <div className="glass-panel p-4 rounded-xl flex items-center justify-between hover:border-primary/30 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-white/5 flex items-center justify-center">
                    <span className="material-icons-outlined text-slate-400">directions_car</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-100 group-hover:text-primary transition-colors">
                      Gas & Tolls
                    </h5>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">
                        Paid by Mark
                      </span>
                      <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                        Split equally
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex items-center gap-8">
                  <div>
                    <p className="text-xs text-slate-500">Total amount</p>
                    <p className="text-lg font-bold text-slate-100">₹85.00</p>
                  </div>
                  <div className="w-24">
                    <p className="text-xs text-slate-500">You owe</p>
                    <p className="text-lg font-bold text-rose-400">₹17.00</p>
                  </div>
                  <button className="material-icons-outlined text-slate-600 hover:text-white transition-colors">
                    more_vert
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-white/5">
            <h3 className="text-lg font-bold text-white mb-6">
              Group Balances
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="glass-panel p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    className="size-10 rounded-full object-cover"
                    alt="Member avatar Sarah"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzyRkyXz-YP-hN3G5hMtXLd0jb8wnWQGJdsx7MhZMngMOD6hYQipi5JuHFWBtacp9MThFIPJid03zCWFUyhUsz3JANV5ChlFVcQ7s7vLPPaJslfJBVm3wJcsIyA9BjJZPjU7MgXzObEMlvnrbcKA4LIYBEqNF0GfTT8IF9-NqVYj-1CMnuV3KPHgjhQo6nB2hVozaHcrgnZA4dbiXzY-I6yJZ2oe6uHiqTz-g6ZC--i0LNgf_TpxLWS9t8zoWQvkdHsAEvYVmaZSc"
                  />
                  <div>
                    <p className="text-sm font-bold">Sarah Jenkins</p>
                    <p className="text-xs text-rose-400">You owe her ₹125.00</p>
                  </div>
                </div>
                <button className="text-primary hover:bg-primary/10 border border-primary/30 rounded-lg px-4 py-1.5 text-xs font-bold transition-all">
                  Settle Up
                </button>
              </div>

              <div className="glass-panel p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    className="size-10 rounded-full object-cover"
                    alt="Member avatar Mark"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCY_vAB0cgUECoTvju-thu0OhqKtQFYJiwEn6UT9FTjU_eKwPITiuaESqoRqKRTrHhMvlAN2grWLYGcyG7WBZPwzOeGDcgDI8x98-zMMuIzFaPOy8uNALWDHNDB5IhrID1gAGYWZWI1Ip5METgzrNfO5p2-63fcE4jhtd4SVitQ_EYuOOQwiAYRg4k4iZb07eUswnJRT9Ss31yla6tb87OGeegWuyMP6ylQ9y7yjVGgVjb_EMlVHEyjYaGHns2wbWiImTF_gX0hNMA"
                  />
                  <div>
                    <p className="text-sm font-bold">Mark Wilson</p>
                    <p className="text-xs text-emerald-400">Owes you ₹240.50</p>
                  </div>
                </div>
                <button className="text-primary hover:bg-primary/10 border border-primary/30 rounded-lg px-4 py-1.5 text-xs font-bold transition-all">
                  Remind
                </button>
              </div>

              <div className="glass-panel p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    className="size-10 rounded-full object-cover"
                    alt="Member avatar John"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOtYH_ha-gmLMLWVXQLNrVlYpaJIyxsGAXlzHOEnPicVb_6ilASVtmPNmxYi_0XdRCj9P7bx53JtyaY-2BBOUoNaJYyoHf0m5l1LIdHzDoelXuH5mebwlAIoUVKt45s7GXHZrPjLZjrg-ckUxJMYfTghfLG_2e1YVwjj-8UGSYD4Y380USAMOF7TY5McyWyW2HTsvYoqpSqkp-ltTmSHNytM8Amm4mCEqxDnxP47q63tKoTGm9HZWIbUNpMRtjumquivzE5g5pV50"
                  />
                  <div>
                    <p className="text-sm font-bold">John Davis</p>
                    <p className="text-xs text-emerald-400">Owes you ₹180.00</p>
                  </div>
                </div>
                <button className="text-primary hover:bg-primary/10 border border-primary/30 rounded-lg px-4 py-1.5 text-xs font-bold transition-all">
                  Remind
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
