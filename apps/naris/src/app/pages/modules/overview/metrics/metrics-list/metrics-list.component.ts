import { Component, Input } from "@angular/core";
import { MetricModel } from "apps/naris/src/app/api/metrics/metric.model";

@Component({
  selector: 'soer-metrics-list',
  templateUrl: 'metrics-list.component.html',
  styleUrls: ['../metrics.component.scss']
})
export class MetricsListComponent {
  @Input() metrics: MetricModel[] = [];
}
