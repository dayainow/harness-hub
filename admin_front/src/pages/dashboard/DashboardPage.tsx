import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { TOOLS_API, PROMPTS_API, POSTS_API, LABS_API } from '@/constants/api-paths';

// ---------- Data Hooks ----------
function useDashboardStats() {
  const products = useQuery({
    queryKey: ['dashboard', 'products'],
    queryFn: async () => {
      const res = await apiService.callWithErrorHandling(
        () => apiService.get(TOOLS_API.PREFIX),
        ''
      );
      const data = (res as any).response?.data?.data || (res as any).response?.data || [];
      return Array.isArray(data) ? data : [];
    },
  });

  const prompts = useQuery({
    queryKey: ['dashboard', 'prompts'],
    queryFn: async () => {
      const res = await apiService.callWithErrorHandling(
        () => apiService.get(PROMPTS_API.PREFIX),
        ''
      );
      const data = (res as any).response?.data?.data || (res as any).response?.data || [];
      return Array.isArray(data) ? data : [];
    },
  });

  const posts = useQuery({
    queryKey: ['dashboard', 'posts'],
    queryFn: async () => {
      const res = await apiService.callWithErrorHandling(
        () => apiService.get(POSTS_API.PREFIX),
        ''
      );
      const data = (res as any).response?.data?.data || (res as any).response?.data || [];
      return Array.isArray(data) ? data : [];
    },
  });

  const market = useQuery({
    queryKey: ['dashboard', 'market'],
    queryFn: async () => {
      const res = await apiService.callWithErrorHandling(
        () => apiService.get(LABS_API.PREFIX),
        ''
      );
      const data = (res as any).response?.data?.data || (res as any).response?.data || [];
      return Array.isArray(data) ? data : [];
    },
  });

  return { products, prompts, posts, market };
}

// ---------- Sub-components ----------
function StatCard({ icon, label, value, gradient, isLoading }: {
  icon: string; label: string; value: number | string; gradient: string; isLoading: boolean;
}) {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br ${gradient} opacity-10`} />
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shadow-lg`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          {isLoading ? (
            <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse mt-1" />
          ) : (
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{value}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function RecentList({ title, icon, items, isLoading, emptyText }: {
  title: string; icon: string; items: any[]; isLoading: boolean; emptyText: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="px-6 py-4">
              <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-slate-100 dark:bg-slate-800 rounded animate-pulse mt-2" />
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="px-6 py-8 text-center text-slate-400">{emptyText}</div>
        ) : (
          items.map((item, idx) => (
            <div key={idx} className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-800 dark:text-white text-sm truncate">{item.title || item.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.category || item.toolName || ''}</p>
              </div>
              <span className="text-xs text-slate-400 ml-4 flex-shrink-0">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ---------- Main Dashboard ----------
export default function DashboardPage() {
  const { products, prompts, posts, market } = useDashboardStats();

  const toolsData = products.data || [];
  const promptsData = prompts.data || [];
  const postsData = posts.data || [];
  const labsData = market.data || [];

  const pendingCount = toolsData.filter((t: any) => t.status === 'PENDING').length;

  return (
    <div className="p-8 max-w-[1400px] mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white pb-1">
          대시보드
        </h1>
        <p className="text-slate-500 font-medium mt-1">Ola AI 플랫폼의 전체 운영 현황을 한눈에 확인합니다.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon="⚙️"
          label="등록된 AI 도구"
          value={toolsData.length}
          gradient="from-sky-500 to-indigo-600"
          isLoading={products.isLoading}
        />
        <StatCard
          icon="🧪"
          label="AI 실험실"
          value={labsData.length}
          gradient="from-emerald-500 to-teal-600"
          isLoading={market.isLoading}
        />
        <StatCard
          icon="💬"
          label="공유 프롬프트"
          value={promptsData.length}
          gradient="from-purple-500 to-pink-600"
          isLoading={prompts.isLoading}
        />
        <StatCard
          icon="📝"
          label="커뮤니티 글"
          value={postsData.length}
          gradient="from-orange-500 to-red-600"
          isLoading={posts.isLoading}
        />
      </div>

      {/* Alert Banner */}
      {pendingCount > 0 && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl flex items-center gap-3">
          <span className="text-2xl">⏳</span>
          <div>
            <p className="font-bold text-amber-800 dark:text-amber-300">
              승인 대기중인 도구가 {pendingCount}건 있습니다
            </p>
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-0.5">AI 도구 관리 메뉴에서 확인하세요.</p>
          </div>
        </div>
      )}

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentList
          title="최근 등록된 도구"
          icon="⚙️"
          items={toolsData.slice(0, 5)}
          isLoading={products.isLoading}
          emptyText="등록된 도구가 없습니다."
        />
        <RecentList
          title="최근 실험실 콘텐츠"
          icon="🧪"
          items={labsData.slice(0, 5)}
          isLoading={market.isLoading}
          emptyText="등록된 실험이 없습니다."
        />
        <RecentList
          title="최근 프롬프트"
          icon="💬"
          items={promptsData.slice(0, 5)}
          isLoading={prompts.isLoading}
          emptyText="등록된 프롬프트가 없습니다."
        />
        <RecentList
          title="최근 커뮤니티 글"
          icon="📝"
          items={postsData.slice(0, 5)}
          isLoading={posts.isLoading}
          emptyText="등록된 게시글이 없습니다."
        />
      </div>
    </div>
  );
}
