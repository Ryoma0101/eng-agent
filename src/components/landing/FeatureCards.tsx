import { Card } from '@/components/ui/card';
import { Target, Briefcase, Trophy } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'AI採点',
    description: 'G(文法)・L(論理)・C(文脈)・F(流暢さ)の4軸でAIが精密に採点',
  },
  {
    icon: Briefcase,
    title: '実務直結',
    description: 'ビジネスニュースを基にした英作文問題で、即戦力のアウトプットを生成',
  },
  {
    icon: Trophy,
    title: '競技として楽しむ',
    description: 'デイリーランキングで仲間と競い合い、称号を獲得してモチベーションUP',
  },
];

export default function FeatureCards() {
  return (
    <div className="mt-16 grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
      {features.map((feature) => {
        const Icon = feature.icon;
        return (
          <Card key={feature.title} className="group relative overflow-hidden p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/0 to-slate-50/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
