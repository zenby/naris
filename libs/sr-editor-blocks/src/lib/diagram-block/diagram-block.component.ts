import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import mermaid from 'mermaid';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'soer-diagram-block',
  templateUrl: './diagram-block.component.html',
  styles: [
    `
      .error {
        color: red;
      }
    `,
  ],
})
export class DiagramBlockComponent implements AfterViewInit {
  public textValue = '';
  public id = 'diagram-' + UUID.UUID();
  public error: string | null = null;

  @Input() set text(value: string) {
    this.textValue = value;
    this.renderDiagram(value);
  }

  @ViewChild('diagram') diagramContainer!: ElementRef;

  constructor(private cdr: ChangeDetectorRef) {}

  public ngAfterViewInit(): void {
    mermaid.initialize({ theme: 'default' });
    this.renderDiagram(this.textValue);
  }

  private async renderDiagram(text: string): Promise<void> {
    if (!this.diagramContainer?.nativeElement) return;

    this.error = null;

    try {
      const { svg, bindFunctions } = await mermaid.render(this.id, text, this.diagramContainer.nativeElement);
      this.diagramContainer.nativeElement.innerHTML = svg;
      bindFunctions?.(this.diagramContainer.nativeElement);
    } catch (err) {
      this.error = err && typeof err === 'object' && 'message' in err ? (err.message as string) : String(err);
    } finally {
      this.cdr.detectChanges();
    }
  }
}
