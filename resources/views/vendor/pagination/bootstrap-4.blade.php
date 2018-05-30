@if ($paginator->hasPages())
    <ul class="pagination">
        {{-- Previous Page Link --}}
        @if ($paginator->onFirstPage())
            <li class="disabled"><a><i class="material-icons grey-text">chevron_left</i></a></li>
        @else
            <li class="waves-effect waves-teal"><a href="{{ $paginator->previousPageUrl() }}" rel="prev"><i class="material-icons grey-text">chevron_left</i></a></li>
        @endif

        {{-- Pagination Elements --}}
        @foreach ($elements as $element)
            {{-- "Three Dots" Separator --}}
            @if (is_string($element))
                <li class="disabled">{{ $element }}</li>
            @endif

            {{-- Array Of Links --}}
            @if (is_array($element))
                @foreach ($element as $page => $url)
                    @if ($page == $paginator->currentPage())
                        <li class="active blue white-text"><a>{{ $page }}</a></li>
                    @else
                        <li class="waves-effect waves-teal"><a href="{{ $url }}">{{ $page }}</a></li>
                    @endif
                @endforeach
            @endif
        @endforeach

        {{-- Next Page Link --}}
        @if ($paginator->hasMorePages())
            <li class="waves-effect waves-teal"><a href="{{ $paginator->nextPageUrl() }}"><i class="material-icons grey-text">chevron_right</i></a></li>
        @else
            <li class="disabled"><a><i class="material-icons grey-text">chevron_right</i></a></li>
        @endif
    </ul>
@endif
