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
          <Card
            key={feature.title}
            className="group p-6 text-center transition-shadow hover:shadow-md"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{feature.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{feature.description}</p>
          </Card>
        );
      })}
    </div>
  );
}
